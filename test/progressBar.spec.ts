/**
 * @jest-environment jsdom
 */
 import ProgressBar from '../src/ts/subView/progressBar'
 import states from './states';

declare var window: any;
declare var global: any;
window.$ = require('jquery');
global['$'] = global['jQuery'] = $;

describe('ProgressBar: ', function () {
  for (let state of states) {
    let progressBar = new ProgressBar(true, state.isVertical);
    const fromPos = 25;
    const toPos = 39;
    const $progressBar = progressBar.render()
    const isVertical = typeof state.isVertical !== 'undefined' ? state.isVertical : false;
    const cssFromSide = isVertical ? 'top' : 'left';
    const cssToSide = isVertical ? 'bottom' : 'right';
    
    $(document.body).append(`${$progressBar}`);
  
    test(`property ${cssFromSide} === ${toPos}%`, function () {
      progressBar.setMinPosition(toPos);
  
      const computedStyleProgressBar = getComputedStyle($progressBar[0]).getPropertyValue(cssFromSide);
  
      expect(Number.parseFloat(computedStyleProgressBar)).toBe(toPos);
    });
    
    test(`property ${cssToSide} === ${fromPos}%`, function () {
      progressBar.setMaxPosition(fromPos);
  
      const computedStyleProgressBar = getComputedStyle($progressBar[0]).getPropertyValue(cssToSide);
  
      expect(Number.parseFloat(computedStyleProgressBar)).toBe(fromPos);
    });
  
    test('method render() must return JQuery', function () {
      expect($progressBar.constructor).toBe($('<div></div>').constructor);
    });
  }
  
});