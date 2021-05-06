/**
 * @jest-environment jsdom
 */

import ProgressBar from '../src/ts/subView/progressBar';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

describe('ProgressBar: ', () => {
  const toPos = 39;
  const fromPos = 25;

  states.forEach(({ isRange, isVertical: vertical }) => {
    const progressBar = new ProgressBar(isRange, vertical);
    const $progressBar = progressBar.render();
    const isVertical = typeof vertical !== 'undefined' ? vertical : false;
    const cssFromSide = isVertical ? 'top' : 'left';
    const cssToSide = isVertical ? 'bottom' : 'right';

    $(document.body).append($progressBar);

    test(`property ${cssFromSide} === ${toPos}%`, () => {
      progressBar.setMinPosition(toPos);

      const ProgressBarStyles = getComputedStyle($progressBar[0]).getPropertyValue(cssFromSide);

      expect(Number.parseFloat(ProgressBarStyles)).toBe(toPos);
    });

    test(`property ${cssToSide} === ${fromPos}%`, () => {
      progressBar.setMaxPosition(fromPos);

      const ProgressBarStyles = getComputedStyle($progressBar[0]).getPropertyValue(cssToSide);

      expect(Number.parseFloat(ProgressBarStyles)).toBe(fromPos);
    });

    test('method render() must return JQuery', () => {
      expect($progressBar.constructor).toBe($('<div></div>').constructor);
    });
  });
});
