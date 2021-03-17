import Model from '../model/model';
import View from '../view/view';

interface IPresenter {
  model: Model,
  view: View
}

export default class Presenter implements IPresenter{
  private state: { 
    min: number,
    max: number
  };

  constructor(public model: Model, public view: View) {
    view.subscribe(this);

    this.state = {
      min: view.getCurrentMin,
      max: view.getCurrentMax,
    }
  }

  public set min(value: number) {
    this.state.min = value;
  }

  public set max(value: number) {
    this.state.max = value;
  }

  public get getMinMax() {
    return {
      min: this.state.min,
      max: this.state.max
    };
  }

  update(action: {type: string, value: number}) {
    switch(action.type) {
      case 'SET_MAX':
        this.max = action.value;
        this.model.setMax = action.value;
        break;
      case 'SET_MIN': 
        this.min = action.value;
        this.model.setMin = action.value;
        break;
      default:
        this.state;
    }
  }
}