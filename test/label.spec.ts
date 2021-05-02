/**
 * @jest-environment jsdom
 */

 import Label from '../src/ts/subView/label'

declare var window: any;
declare var global: any;
window.$ = require('jquery');
global['$'] = global['jQuery'] = $;

describe('Label: ', function () {
  const label = new Label(50, 'maxThumb', 40, false);
  const $label = label.render();
  const newValue = 55;

  $(document.body).append($label);
  
  test('method setValue() must set position in the element', function () {
    label.setValue(newValue);
    expect(Number.parseFloat($label.html())).toBe(newValue);
  });

  test(`label\'s property right === ${newValue}%`, function () {
    label.setPosition(newValue);
    const computedStyleLabel = getComputedStyle($label[0]).getPropertyValue('right');

    expect(Number.parseFloat(computedStyleLabel)).toBe(newValue);
  });
  
  test('method render() must return JQuery', function () {
    expect($label.constructor).toBe($('<div></div>').constructor);
  });
  
  test(`method setValue must be called`, function () {
    const spySetValue = jest.spyOn(Label.prototype, 'setValue');
    spySetValue.mockImplementation(() => {});
    const label = new Label(50, 'maxThumb', 40, false);
    
    expect(spySetValue).toHaveBeenCalled();
  });

  test(`method setPosition must be called`, function () {
    const spySetPosition = jest.spyOn(Label.prototype, 'setPosition');
    spySetPosition.mockImplementation(() => {});
    const label = new Label(50, 'maxThumb', 40, false);
    
    expect(spySetPosition).toHaveBeenCalled();
  });
});