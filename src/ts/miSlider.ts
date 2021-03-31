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
  labels: boolean,
  vertical: boolean,
  inputsId: {
    inputFromId: string,
    inputToId: string,
  }
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
    vertical,
    inputsId
  }: Props) {
    const modelState = {
      max: defaultMax ? defaultMax : max,
      min: defaultMin ? defaultMin : min,
    }
    const model: Model = new Model(modelState.max, modelState.min);
    const view: View = new View(max, min, this, range, step, defaultMin, defaultMax, labels, vertical, inputsId);
    const presenter: Presenter = new Presenter(model, view);

  };

}(jQuery));

