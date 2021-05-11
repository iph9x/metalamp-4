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
  const labels = [
    {
      name: 'toThumb',
      isVertical: false,
    },
    {
      name: 'toThumb',
      isVertical: true,
    },
    {
      name: 'fromThumb',
      isVertical: true,
    },
    {
      name: 'fromThumb',
      isVertical: false,
    },
  ];
  const newValue = 55;
  let label: Label;

  labels.forEach(({ name, isVertical }) => {
    label = new Label({
      value: 50,
      type: name,
      position: 40,
      isVertical,
    });
    const $label = label.render();

    $(document.body).append($label);

    test('method setValue() must set position in the element', () => {
      label.setValue(newValue);
      expect(Number.parseFloat($label.html())).toBe(newValue);
    });

    test(`property right === ${newValue}%`, () => {
      label.setPosition(newValue);
      const computedStyleLabel = getComputedStyle($label[0]);
      let labelPosition;

      if (name === 'toThumb') {
        if (isVertical) {
          labelPosition = computedStyleLabel.getPropertyValue('bottom');
        } else {
          labelPosition = computedStyleLabel.getPropertyValue('right');
        }
      } else if (isVertical) {
        labelPosition = computedStyleLabel.getPropertyValue('top');
      } else {
        labelPosition = computedStyleLabel.getPropertyValue('left');
      }

      expect(Number.parseFloat(labelPosition)).toBe(newValue);
    });

    test('method render() must return JQuery', () => {
      expect($label.constructor).toBe($('<div></div>').constructor);
    });
  });

  labels.forEach(({ name, isVertical }) => {
    test('method setValue() must be called', () => {
      const spySetValue = jest.spyOn(Label.prototype, 'setValue');
      spySetValue.mockImplementation(() => {});
      label = new Label({
        value: 50,
        type: name,
        position: 40,
        isVertical,
      });

      expect(spySetValue).toHaveBeenCalled();
    });

    test('method setPosition() must be called', () => {
      const spySetPosition = jest.spyOn(Label.prototype, 'setPosition');
      spySetPosition.mockImplementation(() => {});
      label = new Label({
        value: 50,
        type: name,
        position: 40,
        isVertical,
      });

      expect(spySetPosition).toHaveBeenCalled();
    });
  });
});
