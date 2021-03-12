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
  }) {
    const model: Model = new Model(props.max, props.min);
    const view: View = new View(props.max, props.min, props.range, this, props.step, props.defaultMin, props.defaultMax);
    const presenter: Presenter = new Presenter(model, view);

  };

}(jQuery));

