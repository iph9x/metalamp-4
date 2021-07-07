/**
 * @jest-environment jsdom
 */

import Thumb from '../src/slider/subView/thumb';
import ProgressBar from '../src/slider/subView/progressBar';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

type OptionsType = Array<{
  thumbName: 'fromThumb' | 'toThumb',
  start: number,
  isVertical: boolean,
}>;

describe('Label: ', () => {
  const progressBar = new ProgressBar(true);
  const $wrapper = $('<div class="mi-slider__wrapper"></div>');
  const { to, max, min } = states[4];

  const thumbsOptions: OptionsType = [
    {
      thumbName: 'fromThumb',
      start: min,
      isVertical: false,
    },
    {
      thumbName: 'toThumb',
      start: to,
      isVertical: true,
    },
  ];

  thumbsOptions.forEach((thumbOptions) => {
    const { thumbName, start, isVertical } = thumbOptions;
    let thumb = new Thumb({
      type: thumbName,
      startPosition: start,
      wrapper: $wrapper,
      progressBar,
      max,
      min,
      otherThumbPosition: 60,
      vertical: isVertical,
      isRange: true,
    });
    const $thumb = thumb.render();

    $(document.body).append($wrapper);
    $(document.body).append($thumb);

    test('method handleThumbMove() must be called on document.on(\'mousemove\')', () => {
      const spySetPosition = jest.spyOn(thumb, 'handleThumbMove');
      $thumb.trigger('mousedown');
      $(document).trigger('mousemove');
      expect(spySetPosition).toHaveBeenCalled();
    });

    test('on document.on(\'mouseup\') isActive === false', () => {
      const spySetIsActive = jest.spyOn(thumb, 'setIsActive');
      $(document).trigger('mouseup');
      expect(spySetIsActive).toHaveBeenCalled();
    });

    test('method render() must return JQuery', () => {
      expect($thumb.constructor).toBe($('<div></div>').constructor);
    });

    test('method setIsActive() must be called', () => {
      const spySetIsActive = jest.spyOn(thumb, 'setIsActive');
      $thumb.trigger('mousedown');

      spySetIsActive.mockImplementation(() => {});
      expect(spySetIsActive).toHaveBeenCalled();
    });

    test('method setPositionByValue() must be called', () => {
      const spySetPositionByVal = jest.spyOn(Thumb.prototype, 'setPositionByValue');
      spySetPositionByVal.mockImplementation(() => {});

      thumb = new Thumb({
        type: thumbName,
        startPosition: start,
        wrapper: $wrapper,
        progressBar,
        max,
        min,
        otherThumbPosition: 60,
        vertical: isVertical,
        isRange: true,
      });

      expect(spySetPositionByVal).toHaveBeenCalled();
    });
  });
});
