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
  let model: Model;
  let view: View;
  let presenter: Presenter;

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
        const $this = $(this);
        const data = $this.data('miSlider');
        const miSlider = $('<div />', {
        });

        if (!data) {
          const modelState = {
            max: to || max,
            min: from || min,
          };

          model = new Model(modelState.max, modelState.min);
          view = new View({
            max,
            min,
            slider: $this,
            isRange: range,
            step,
            from,
            to,
            labelsVisibility: labels,
            isVertical: vertical,
            inputFromId,
            inputToId,
          });
          presenter = new Presenter(model, view);
          $(this).data('miSlider', {
            target: $this,
            miSlider,
          });
          return presenter;
        }
      });
    },
    destroy() {
      return this.each(function destroySlider() {
        const $this = $(this);
        const data = $this.data('miSlider');

        view.destroy($this);
        $this.empty();
        view = undefined;
        model = undefined;
        presenter = undefined;

        $(window).unbind('.miSlider');

        data.miSlider.remove();
        $this.removeData('miSlider');
      });
    },
  };
  // eslint-disable-next-line
  $.fn.miSlider = function jqSlider(method: 'init' | 'destroy' | Props, ...args: []): object {
    const that = this;

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
