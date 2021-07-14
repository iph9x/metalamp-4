/**
 * @jest-environment jsdom
 */

import Scale from '../src/slider/subView/Scale';
import Thumb from '../src/slider/subView/Thumb';
import ProgressBar from '../src/slider/subView/ProgressBar';
import Label from '../src/slider/subView/Label';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

jest.mock('../src/slider/subView/Label');
jest.mock('../src/slider/subView/Thumb');
jest.mock('../src/slider/subView/ProgressBar');

describe('Scale:', () => {
  const progressBar = new ProgressBar(true);
  const $wrapper = $('<div class="mi-slider__wrapper"></div>');

  const ThumbMock = Thumb as jest.MockedClass<typeof Thumb>;
  const ProgressBarMock = ProgressBar as jest.MockedClass<typeof ProgressBar>;
  const LabelMock = Label as jest.MockedClass<typeof Label>;

  states.forEach(({
    max,
    min,
    step,
    to,
    from,
    isVertical,
    isRange,
  }) => {
    const toLabel = new Label({
      value: to,
      type: 'toThumb',
      position: 20,
    });
    let fromLabel: Label;
    let fromThumb: Thumb;
    if (!isRange) {
      fromLabel = new Label({
        value: from,
        type: 'fromThumb',
        position: 20,
      });
      fromThumb = new Thumb({
        type: 'fromThumb',
        startPosition: from,
        step,
        $wrapper: $wrapper,
        progressBar,
        max,
        min,
        label: fromLabel,
      });
    }

    const toThumb = new Thumb({
      type: 'toThumb',
      step,
      startPosition: to,
      $wrapper: $wrapper,
      progressBar,
      max,
      min,
      label: toLabel,
    });
    const scale = new Scale({
      step,
      min,
      max,
      toThumbPosition: 70,
      setToThumb: toThumb.handleThumbMove,
      setToThumbActive: toThumb.setIsActive,
      fromThumbPosition: from,
      setFromThumb: fromThumb?.handleThumbMove,
      isVertical,
      setFromThumbActive: fromThumb?.setIsActive,
      isRange,
    });

    const $scale = scale.render();
    const spy = jest.spyOn(scale, 'handleScaleMousedown');

    test('the Scale called Label\'s construcotr', () => {
      expect(LabelMock).toHaveBeenCalled();
    });

    test('the Scale called Thumb\'s construcotr', () => {
      expect(ThumbMock).toHaveBeenCalled();
    });

    test('the Scale called ProgressBar\'s construcotr', () => {
      expect(ProgressBarMock).toHaveBeenCalled();
    });

    test('method handleScaleMousedown() must be called', () => {
      $(document.body).append($wrapper);
      $(document.body).append($scale);
      $scale.trigger('mousedown');
      expect(spy).toHaveBeenCalled();
      $scale.trigger('mousemove');
      $scale.trigger('mouseup');
    });

    test('method render() must return JQuery', () => {
      expect($scale.constructor).toBe($('<div></div>').constructor);
    });
  });
});
