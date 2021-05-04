/**
 * @jest-environment jsdom
 */

import View from '../src/ts/view/view';
import Model from '../src/ts/model/model';
import Presenter from '../src/ts/presenter/presenter';

declare const window: any;
declare const global: any;
window.$ = require('jquery');

global.jQuery = $;
global.$ = global.jQuery;

describe('View: ', () => {
  const $root = $('<div></div>');

  $(document.body).append($root);

  const from = 200;
  const to = 500;

  const view = new View({ slider: $root });
  const model = new Model({ min: from, max: to });

  const presenter = new Presenter(model, view);

  test('update Presenter return right state', () => {
    expect(presenter.state).toEqual({ fromValue: from, toValue: to });
  });
});
