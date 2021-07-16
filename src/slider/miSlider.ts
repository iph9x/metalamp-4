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
          const that = $(this);

          this.model = new Model({
            max: that.data('max') ?? max,
            min: that.data('min') ?? min,
            from: that.data('from') ?? from,
            to: that.data('to') ?? to,
            step: that.data('step') ?? step,
          });

          this.view = new View({
            slider: this,
            isRange: that.data('isRange') ?? isRange,
            hasLabels: that.data('hasLabels') ?? hasLabels,
            isVertical: that.data('isVertical') ?? isVertical,
            inputFromClass: that.data('inputFromClass') ?? inputFromClass,
            inputToClass: that.data('inputToClass') ?? inputToClass,
          });

          this.presenter = new Presenter(this.model, this.view);

          that.data('miSlider', this);
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

    updateValues(obj: {
      from: number,
      to: number,
    }) {
      return this.each(function updateSlider() {
        const that = $(this);
        const data = that.data('miSlider');
        const { from, to } = obj;

        if (typeof from !== 'undefined' || typeof to !== 'undefined') {
          const fromValue = from ?? data.presenter.state.fromValue;
          const toValue = to ?? data.presenter.state.toValue;

          if (fromValue < toValue) {
            if (typeof fromValue === 'number' && typeof from !== 'undefined') {
              data.presenter.updateFrom(fromValue);
            }

            if (typeof toValue === 'number') {
              data.presenter.updateTo(toValue);
            }
          }
        }
      });
    },

    update({
      max,
      min,
      isRange,
      step,
      from,
      to,
      hasLabels,
      isVertical,
    }: Props) {
      return this.each(function updateSlider() {
        const that = $(this);
        const data = that.data('miSlider');

        const optionsWereUpdated = typeof max !== 'undefined'
          || typeof min !== 'undefined'
          || typeof isRange !== 'undefined'
          || typeof step !== 'undefined'
          || typeof hasLabels !== 'undefined'
          || typeof isVertical !== 'undefined';

        if (optionsWereUpdated) {
          const newModelOptions = {
            max: max ?? data.model.getMax(),
            min: min ?? data.model.getMin(),
            step: step ?? data.model.getStep(),
            to: to ?? data.model.getToValue(),
            from: from ?? data.model.getFromValue(),
          };
          const newViewOptions = {
            slider: this,
            isVertical: isVertical ?? data.view.getIsVertical(),
            isRange: isRange ?? data.view.getIsRange(),
            hasLabels: hasLabels ?? data.view.getHasLabels(),
            inputFromClass: data.view.getInputFromClass(),
            inputToClass: data.view.getInputToClass(),
          };

          that.empty();
          that.removeData('miSlider');

          this.model = new Model({ ...newModelOptions });
          this.view = new View({ ...newViewOptions });
          this.presenter = new Presenter(this.model, this.view);

          that.data('miSlider', this);
          this.presenter.run();
        }
      });
    },
  };
  // eslint-disable-next-line
  $.fn.miSlider = function jqSlider(
    method?: 'init' | 'destroy' | 'update' | 'updateValues' | Props,
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
