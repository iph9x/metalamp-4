import Model from '../model/model';
import View from '../view/view';

interface PresenterInterface {
  model: Model,
  view: View
}

export default class Presenter implements PresenterInterface{
  model: Model;
  view: View;

  private state: { min: number, max: number };

  constructor(model: Model, view: View) {
    view.subscribe(this);
    this.state = {
      min: view.getCurrentMin,
      max: view.getCurrentMax,
    }

    this.model = model;
    this.view = view;
  }

  public set setMin(value: number) {
    this.state.min = value;
  }

  public set setMax(value: number) {
    this.state.max = value;
  }

  public get getMinMax() {
    return [this.state.min, this.state.max]
  }

  update(action: {type: string, value: number}) {
    switch(action.type) {
      case 'SET_MAX':
        this.setMax = action.value;
        this.model.setCurrentMax = action.value;
        break;
      case 'SET_MIN': 
        this.setMin = action.value;
        this.model.setCurrentMin = action.value;
        break;
      default:
        this.state;
    }
  }
}