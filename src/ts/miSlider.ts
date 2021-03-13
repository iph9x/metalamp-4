import View from './view/view';
import Model from './model/model';
import Presenter from './presenter/presenter';

(function ($) {

  $.fn.miSlider = function(props?: {
    min?: number,
    max?: number,
    range?: boolean,
    step?: number,
    defaultMin?: number,
    defaultMax?: number,
    labels?: boolean,
  }) {
    const model: Model = new Model(props.max, props.min);
    const view: View = new View(props.max, props.min, this, props.range, props.step, props.defaultMin, props.defaultMax, props.labels);
    const presenter: Presenter = new Presenter(model, view);

  };

}(jQuery));

