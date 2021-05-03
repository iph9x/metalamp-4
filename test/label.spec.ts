/**
 * @jest-environment jsdom
 */

import Label from '../src/ts/subView/label';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

describe('Label: ', () => {
  let label = new Label(50, 'maxThumb', 40, false);
  const $label = label.render();
  const newValue = 55;

  $(document.body).append($label);

  test('method setValue() must set position in the element', () => {
    label.setValue(newValue);
    expect(Number.parseFloat($label.html())).toBe(newValue);
  });

  test(`property right === ${newValue}%`, () => {
    label.setPosition(newValue);
    const computedStyleLabel = getComputedStyle($label[0]).getPropertyValue('right');

    expect(Number.parseFloat(computedStyleLabel)).toBe(newValue);
  });

  test('method render() must return JQuery', () => {
    expect($label.constructor).toBe($('<div></div>').constructor);
  });

  test('method setValue() must be called', () => {
    const spySetValue = jest.spyOn(Label.prototype, 'setValue');
    spySetValue.mockImplementation(() => {});
    label = new Label(50, 'maxThumb', 40, false);

    expect(spySetValue).toHaveBeenCalled();
  });

  test('method setPosition() must be called', () => {
    const spySetPosition = jest.spyOn(Label.prototype, 'setPosition');
    spySetPosition.mockImplementation(() => {});
    label = new Label(50, 'maxThumb', 40, false);

    expect(spySetPosition).toHaveBeenCalled();
  });
});
