/**
 * @jest-environment jsdom
 */

import View from '../src/slider/view/view';
import Model from '../src/slider/model/model';
import Presenter from '../src/slider/presenter/presenter';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

describe('Presenter: ', () => {
  const $root = $('<div></div>');

  $(document.body).append($root);

  const from = 200;
  const to = 500;
  const newFrom = 300;
  const newTo = 400;

  const spyViewRun = jest.spyOn(Presenter.prototype, 'run');

  const view = new View({ slider: $root });
  const model = new Model({ min: from, max: to });

  const presenter = new Presenter(model, view);

  test('Presenter return right state', () => {
    expect(presenter.getState()).toEqual({ fromValue: from, toValue: to });
  });

  test('view.run() must be called', () => {
    presenter.run();
    expect(spyViewRun).toHaveBeenCalled();
  });

  test('update Presenter return right state', () => {
    presenter.updateFrom(newFrom);
    presenter.updateTo(newTo);

    expect(presenter.getState()).toEqual({ fromValue: newFrom, toValue: newTo });
  });
});
