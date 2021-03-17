import View from './view/view';
import Model from './model/model';
import Presenter from './presenter/presenter';

type Props = {
  max: number,
  min: number,
  range: boolean,
  step: number,
  defaultMin: number,
  defaultMax: number,
  labels: boolean
}

(function ($) {

  $.fn.miSlider = function({
    max,
    min,
    range,
    step,
    defaultMin,
    defaultMax,
    labels,
  }: Props) {
    const model: Model = new Model(max, min);
    const view: View = new View(max, min, this, range, step, defaultMin, defaultMax, labels);
    const presenter: Presenter = new Presenter(model, view);

  };

}(jQuery));

