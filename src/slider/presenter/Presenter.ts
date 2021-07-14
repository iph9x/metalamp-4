import Model from '../model/Model';
import View from '../view/View';

interface IPresenter {
  model: Model,
  view: View,
  getState(): {},
  run(): void,
  updateFrom(value: number): void,
  updateTo(value: number): void,
  update(action: { type: string, value: number }): void,
}

export default class Presenter implements IPresenter {
  constructor(public model: Model, public view: View) {
    this.view.setMax(this.model.getMax());
    this.view.setMin(this.model.getMin());
    this.view.setFrom(this.model.getFromValue());
    this.view.setTo(this.model.getToValue());
    this.view.setStep(this.model.getStep());

    this.view.subscribe(this);
    this.model.subscribe(this);
  }

  public run() {
    this.view.run();
  }

  public updateFrom(value: number): void {
    this.model.updateFromValue(value);
  }

  public updateTo(value: number): void {
    this.model.updateToValue(value);
  }

  public getState(): {} {
    return {
      fromValue: this.model.getFromValue(),
      toValue: this.model.getToValue(),
    };
  }

  public update(action: { type: string, value: number }): void {
    switch (action.type) {
      case 'SET_TO_VALUE':
        this.model.setToValue(action.value);
        break;
      case 'SET_FROM_VALUE':
        this.model.setFromValue(action.value);
        break;
      case 'UPDATE_MODEL_FROM':
        this.view.updateFrom(action.value);
        break;
      case 'UPDATE_MODEL_TO':
        this.view.updateTo(action.value);
        break;
      default:
        break;
    }
  }
}
