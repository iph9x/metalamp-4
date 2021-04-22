import View from './view/view';
import Model from './model/model';
import Presenter from './presenter/presenter';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  from?: number,
  to?: number,
  labels?: boolean,
  vertical?: boolean,
  inputFromId?: string,
  inputToId?: string,
};

// eslint-disable-next-line
(function ($) {
  const methods = {
    init({
      max,
      min,
      range,
      step,
      from,
      to,
      labels,
      vertical,
      inputFromId,
      inputToId,
    }: Props) {
      // eslint-disable-next-line
      return this.each(function initSlider() {
        if (!this.data) {
          const modelState = {
            max: to || max,
            min: from || min,
          };

          this.model = new Model(modelState.max, modelState.min);
          this.view = new View({
            max,
            min,
            slider: this,
            isRange: range,
            step,
            from,
            to,
            labelsVisibility: labels,
            isVertical: vertical,
            inputFromId,
            inputToId,
          });
          this.presenter = new Presenter(this.model, this.view);
          $(this).data('miSlider', this);

          return this.presenter;
        }
      });
    },
    destroy() {
      return this.each(function destroySlider() {
        const that = $(this);
        const data = that.data('miSlider');

        data.view.destroy(that);
        that.empty();
        data.view = undefined;
        data.model = undefined;
        data.presenter = undefined;

        that.removeData('miSlider');
      });
    },
    update(obj: { from?: number, to?: number }) {
      return this.each(function updateSlider() {
        const that = $(this);
        const data = that.data('miSlider');

        let { from, to } = obj;

        if (from && to && from >= to) {
          from = obj.to;
          to = obj.from;
        }

        if (typeof from === 'number') {
          data.presenter.updateFrom(from);
        }
        if (typeof to === 'number') {
          data.presenter.updateTo(to);
        }
      });
    },
  };
  // eslint-disable-next-line
  $.fn.miSlider = function jqSlider(
    method: 'init' | 'destroy' | Props,
    ...args: []
  ): object {
    const that = $(this);

    if (typeof method === 'string' && methods[method]) {
      return methods[method].apply(that, args);
    }
    if (typeof method === 'object') {
      // eslint-disable-next-line
      return methods.init.apply(that, arguments);
    }
    return $.error(`${method} method doesn't exist`);
  };
}(jQuery));
