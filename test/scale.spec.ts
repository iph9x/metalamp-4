/**
 * @jest-environment jsdom
 */

 import Scale from '../src/ts/subView/scale'
 import Thumb from '../src/ts/subView/thumb'
 import ProgressBar from '../src/ts/subView/progressBar'
 import Label from '../src/ts/subView/label'
 import states from './states';

 declare var window: any;
 declare var global: any;
 window.$ = require('jquery');
 global['$'] = global['jQuery'] = $;

 jest.mock('../src/ts/subView/label');
 jest.mock('../src/ts/subView/thumb');
 jest.mock('../src/ts/subView/progressBar');

let minThumb: Thumb;
let maxThumb: Thumb;
let scale: Scale;
let progressBar = new ProgressBar(true);
let wrapper = $('<div class="mi-slider__wrapper"></div>');
let minLabel: Label;
let maxLabel: Label;

const ThumbMock = Thumb as jest.MockedClass<typeof Thumb>;
const ProgressBarMock = ProgressBar as jest.MockedClass<typeof ProgressBar>;
const LabelMock = Label as jest.MockedClass<typeof Label>;

describe('Scale:', function () {
  let state = states[0];

  maxLabel = new Label(state.to, 'maxThumb', 20);
  minLabel = new Label(state.from, 'minThumb', 20);
  minThumb = new Thumb({
    type: 'minThumb',
    startPosition: state.from,
    step: state.step,
    wrapper,
    progressBar,
    max: state.max,
    min: state.min,
    label: minLabel,
  });
  maxThumb = new Thumb({
    type: 'maxThumb',
    step: state.step,
    startPosition: state.to,
    wrapper,
    progressBar,
    max: state.max,
    min: state.min,
    label: maxLabel,
  });
  scale = new Scale(
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

  const scaleEl = scale.render();
  const spy = jest.spyOn(scale, 'clickHandler');
  
  test('the Scale called Label\'s construcotr', function () {
    expect(LabelMock).toHaveBeenCalled();
  });
  test('the Scale called Thumb\'s construcotr', function () {
    expect(ThumbMock).toHaveBeenCalled();
  });
  test('the Scale called ProgressBar\'s construcotr', function () {
    expect(ProgressBarMock).toHaveBeenCalled();
  });
  test('method clickHandler() must be called', function () {
    $(document.body).append(`${wrapper}`);
    $(document.body).append(`${scaleEl}`);
    scaleEl.trigger('mousedown');
    expect(spy).toHaveBeenCalled();
  });
  test('method render() must return JQuery', function () {
    expect(scaleEl.constructor).toBe($('<div></div>').constructor);
  });
});