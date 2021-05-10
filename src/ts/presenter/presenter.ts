import Model from '../model/model';
import View from '../view/view';

interface IPresenter {
  model: Model,
  view: View,
  state: {},
  run(): void,
  updateFrom(value: number): void,
  updateTo(value: number): void,
  update(action: { type: string, value: number }): void,
}

export default class Presenter implements IPresenter {
  constructor(public model: Model, public view: View) {
    this.view.max = this.model.max;
    this.view.min = this.model.min;
    this.view.from = this.model.fromValue;
    this.view.to = this.model.toValue;
    this.view.step = this.model.step;

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

  public get state(): {} {
    return {
      fromValue: this.model.fromValue,
      toValue: this.model.toValue,
    };
  }

  public update(action: { type: string, value: number }): void {
    switch (action.type) {
      case 'SET_TO_VALUE':
        this.model.toValue = action.value;
        break;
      case 'SET_FROM_VALUE':
        this.model.fromValue = action.value;
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
