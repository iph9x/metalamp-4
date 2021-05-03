/**
 * @jest-environment jsdom
 */

import Thumb from '../src/ts/subView/thumb';
import ProgressBar from '../src/ts/subView/progressBar';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

describe('Label: ', () => {
  const progressBar = new ProgressBar(true);
  const $wrapper = $('<div class="mi-slider__wrapper"></div>');

  const { to, max, min } = states[0];
  let thumb = new Thumb({
    type: 'maxThumb',
    startPosition: to,
    wrapper: $wrapper,
    progressBar,
    max,
    min,
    otherThumbPosition: 20,
    vertical: false,
    isRange: true,
  });
  const $thumb = thumb.render();

  $(document.body).append($wrapper);
  $(document.body).append($thumb);

  test('method setPositionHandler() must be called on document.on(\'mousemove\')', () => {
    const spySetPosition = jest.spyOn(thumb, 'setPositionHandler');
    $thumb.trigger('mousedown');
    $(document).trigger('mousemove');
    expect(spySetPosition).toHaveBeenCalled();
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

  test('method setPositionByVal() must be called', () => {
    const spySetPositionByVal = jest.spyOn(Thumb.prototype, 'setPositionByVal');
    spySetPositionByVal.mockImplementation(() => {});

    thumb = new Thumb({
      type: 'maxThumb',
      startPosition: to,
      wrapper: $wrapper,
      progressBar,
      max,
      min,
      otherThumbPosition: 20,
      vertical: false,
      isRange: true,
    });

    expect(spySetPositionByVal).toHaveBeenCalled();
  });
});
