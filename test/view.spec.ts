/**
 * @jest-environment jsdom
 */

import View from '../src/slider/view/view';
import Thumb from '../src/slider/subView/thumb';
import Scale from '../src/slider/subView/scale';
import ProgressBar from '../src/slider/subView/progressBar';
import Label from '../src/slider/subView/label';
import states from './states';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

jest.mock('../src/slider/subView/thumb');
jest.mock('../src/slider/subView/label');
jest.mock('../src/slider/subView/progressBar');
jest.mock('../src/slider/subView/scale');

const ThumbMock = Thumb as jest.MockedClass<typeof Thumb>;
const ProgressBarMock = ProgressBar as jest.MockedClass<typeof ProgressBar>;
const LabelMock = Label as jest.MockedClass<typeof Label>;
const ScaleMock = Scale as jest.MockedClass<typeof Scale>;

describe('View: ', () => {
  const $root = $('<div></div>');
  let view: View;

  $(document.body).append($root);

  beforeEach(() => {
    ThumbMock.mockClear();
    ProgressBarMock.mockClear();
    LabelMock.mockClear();
    ScaleMock.mockClear();
  });

  states.forEach(({
    isVertical,
    isRange,
    min,
    max,
    from,
    to,
    inputFromClass,
    inputToClass,
  }) => {
    test('View called the Thumb constructor at least once', () => {
      view = new View({
        slider: $root,
        isVertical,
        isRange,
        inputFromClass,
        inputToClass,
      });
      view.setMin(min);
      view.setMax(max);

      view.run();
      expect(ThumbMock).toHaveBeenCalled();
    });

    test('View called the Scale constructor once', () => {
      view = new View({ slider: $root });
      view.run();
      expect(ScaleMock).toHaveBeenCalledTimes(1);
    });

    test('View called the ProgressBar constructor once', () => {
      view = new View({ slider: $root });
      view.setMin(min);
      view.setMax(max);
      view.run();
      expect(ProgressBarMock).toHaveBeenCalledTimes(1);
    });

    test('View called the Label constructor two times', () => {
      view = new View({ slider: $root });
      view.setMin(min);
      view.setMax(max);
      view.run();
      expect(LabelMock).toHaveBeenCalledTimes(2);
    });

    test('method render() must be called on run()', () => {
      view = new View({ slider: $root });
      view.setMin(min);
      view.setMax(max);
      const spyViewRender = jest.spyOn(view, 'run');
      spyViewRender.mockImplementation(() => {});

      view.run();
      expect(spyViewRender).toHaveBeenCalled();
    });

    test('typeof "from" is number', () => {
      view = new View({ slider: $root });
      view.setMin(min);
      view.setMax(max);
      view.setFrom(from);
      expect(view.getFrom()).toBe(from);
    });

    test('typeof "to" is number', () => {
      view = new View({ slider: $root });
      view.setMin(min);
      view.setMax(max);
      view.setTo(to);
      expect(view.getTo()).toBe(to);
    });
  });
});
