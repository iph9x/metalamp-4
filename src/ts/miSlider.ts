import View from './view/view';
import Model from './model/model';
import Presenter from './presenter/presenter';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  defaultFromValue?: number,
  defaultToValue?: number,
  labels?: boolean,
  vertical?: boolean,
  inputsId?: {
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
    defaultFromValue,
    defaultToValue,
    labels,
    vertical,
    inputsId
  }: Props) {
    const modelState = {
      max: defaultToValue ? defaultToValue : max,
      min: defaultFromValue ? defaultFromValue : min,
    }
    const model: Model = new Model(modelState.max, modelState.min);
    const view: View = new View({max, min, slider: this, isRange: range, step, defaultFromValue, defaultToValue, labelsVisibility: labels, isVertical: vertical, inputsId});
    const presenter: Presenter = new Presenter(model, view);
  };

}(jQuery));

