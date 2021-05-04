/**
 * @jest-environment jsdom
 */

import View from '../src/ts/view/view';
import Thumb from '../src/ts/subView/thumb';
import Scale from '../src/ts/subView/scale';
import ProgressBar from '../src/ts/subView/progressBar';
import Label from '../src/ts/subView/label';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

jest.mock('../src/ts/subView/thumb');
jest.mock('../src/ts/subView/label');
jest.mock('../src/ts/subView/progressBar');
jest.mock('../src/ts/subView/scale');

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

  test('View called Thumb\'s constructor two times', () => {
    view = new View({ slider: $root });
    view.run();
    expect(ThumbMock).toHaveBeenCalledTimes(2);
  });

  test('View called Scale\'s constructor once', () => {
    view = new View({ slider: $root });
    view.run();
    expect(ScaleMock).toHaveBeenCalledTimes(1);
  });

  test('View called ProgressBar\'s constructor once', () => {
    view = new View({ slider: $root });
    view.run();
    expect(ProgressBarMock).toHaveBeenCalledTimes(1);
  });

  test('View called Label\'s constructor once', () => {
    view = new View({ slider: $root });
    view.run();
    expect(LabelMock).toHaveBeenCalledTimes(2);
  });

  test('method render() must be called on run()', () => {
    view = new View({ slider: $root });
    const spyViewRender = jest.spyOn(view, 'run');
    spyViewRender.mockImplementation(() => {});

    view.run();
    expect(spyViewRender).toHaveBeenCalled();
  });

  test('typeof from is number', () => {
    view = new View({ slider: $root });
    const from = 10;
    view.from = from;
    expect(view.from).toBe(from);
  });

  test('typeof to is number', () => {
    view = new View({ slider: $root });
    const to = 100;
    view.to = to;
    expect(view.to).toBe(to);
  });
});
