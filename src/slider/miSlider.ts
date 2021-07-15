import View from './view/View';
import Model from './model/Model';
import Presenter from './presenter/Presenter';

type Props = {
  max?: number,
  min?: number,
  isRange?: boolean,
  step?: number,
  from?: number,
  to?: number,
  hasLabels?: boolean,
  isVertical?: boolean,
  inputFromClass?: string,
  inputToClass?: string,
};

// eslint-disable-next-line
(function ($) {
  const methods = {
    init({
      max,
      min,
      isRange,
      step,
      from,
      to,
      hasLabels,
      isVertical,
      inputFromClass,
      inputToClass,
    }: Props = {}) {
      // eslint-disable-next-line
      return this.each(function initSlider() {
        if (!this.data) {
          this.model = new Model({
            max,
            min,
            from,
            to,
            step,
          });

          this.view = new View({
            slider: this,
            isRange,
            hasLabels,
            isVertical,
            inputFromClass,
            inputToClass,
          });

          this.presenter = new Presenter(this.model, this.view);

          $(this).data('miSlider', this);

          this.presenter.run();
        }
      });
    },

    destroy() {
      return this.each(function destroySlider() {
        const that = $(this);

        that.empty();
        that.removeData('miSlider');
      });
    },

    update(obj: { from?: number, to?: number }) {
      return this.each(function updateSlider() {
        const that = $(this);
        const data = that.data('miSlider');

        let { from, to } = obj;
        from = from ?? data.presenter.state.fromValue;
        to = to ?? data.presenter.state.toValue;

        if (from < to) {
          if (typeof from === 'number') {
            data.presenter.updateFrom(from);
          }

          if (typeof to === 'number') {
            data.presenter.updateTo(to);
          }
        }
      });
    },
  };
  // eslint-disable-next-line
  $.fn.miSlider = function jqSlider(
    method?: 'init' | 'destroy' | 'update' | Props,
    ...args: []
  ): object {
    const that = $(this);

    if (typeof method === 'string' && methods[method]) {
      return methods[method].apply(that, args);
    }

    if (typeof method === 'object' || !method) {
      // eslint-disable-next-line
      return methods.init.apply(that, arguments);
    }

    return $.error(`${method} method doesn't exist`);
  };
}(jQuery));
