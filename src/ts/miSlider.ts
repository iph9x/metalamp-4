import View from './view/view';

(function ($) {

  $.fn.miSlider = function(props?: {
    min?: number,
    max?: number,
    range?: boolean,
    step?: number,
    defaultMin?: number,
    defaultMax?: number,
  }) {
    const app = new View(props.max, props.min, props.range, this, props.step, props.defaultMin, props.defaultMax);
  };

}(jQuery));

