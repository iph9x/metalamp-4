/**
 * @jest-environment jsdom
 */

import Scale from '../src/ts/subView/scale';
import Thumb from '../src/ts/subView/thumb';
import ProgressBar from '../src/ts/subView/progressBar';
import Label from '../src/ts/subView/label';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

jest.mock('../src/ts/subView/label');
jest.mock('../src/ts/subView/thumb');
jest.mock('../src/ts/subView/progressBar');

describe('Scale:', () => {
  const progressBar = new ProgressBar(true);
  const $wrapper = $('<div class="mi-slider__wrapper"></div>');

  const ThumbMock = Thumb as jest.MockedClass<typeof Thumb>;
  const ProgressBarMock = ProgressBar as jest.MockedClass<typeof ProgressBar>;
  const LabelMock = Label as jest.MockedClass<typeof Label>;

  const state = states[0];

  const maxLabel = new Label(state.to, 'maxThumb', 20);
  const minLabel = new Label(state.from, 'minThumb', 20);
  const minThumb = new Thumb({
    type: 'minThumb',
    startPosition: state.from,
    step: state.step,
    wrapper: $wrapper,
    progressBar,
    max: state.max,
    min: state.min,
    label: minLabel,
  });
  const maxThumb = new Thumb({
    type: 'maxThumb',
    step: state.step,
    startPosition: state.to,
    wrapper: $wrapper,
    progressBar,
    max: state.max,
    min: state.min,
    label: maxLabel,
  });
  const scale = new Scale(
    state.min,
    state.max,
    70,
    maxThumb.setPositionHandler,
    maxThumb.setIsActive,
    state.from,
    minThumb?.setPositionHandler,
    false,
    minThumb?.setIsActive,
    true,
  );

  const $scale = scale.render();
  const spy = jest.spyOn(scale, 'clickHandler');

  test('the Scale called Label\'s construcotr', () => {
    expect(LabelMock).toHaveBeenCalled();
  });

  test('the Scale called Thumb\'s construcotr', () => {
    expect(ThumbMock).toHaveBeenCalled();
  });

  test('the Scale called ProgressBar\'s construcotr', () => {
    expect(ProgressBarMock).toHaveBeenCalled();
  });

  test('method clickHandler() must be called', () => {
    $(document.body).append($wrapper);
    $(document.body).append($scale);
    $scale.trigger('mousedown');
    expect(spy).toHaveBeenCalled();
  });

  test('method render() must return JQuery', () => {
    expect($scale.constructor).toBe($('<div></div>').constructor);
  });
});
