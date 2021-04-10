import Model from '../model/model';
import View from '../view/view';

interface IPresenter {
  model: Model,
  view: View,
  state: {}
}

export default class Presenter implements IPresenter{
  private _state: { 
    fromValue: number,
    toValue: number
  };

  constructor(public model: Model, public view: View) {
    view.subscribe(this);

    this._state = {
      fromValue: view.getFromValue,
      toValue: view.getToValue,
    }
  }

  public set fromValue(value: number) {
    this._state.fromValue = value;
  }

  public set toValue(value: number) {
    this._state.toValue = value;
  }

  public get state(): {} {
    return {
      fromValue: this._state.fromValue,
      toValue: this._state.toValue
    };
  }

  update(action: {type: string, value: number}) {
    switch(action.type) {
      case 'SET_TO_VALUE':
        this.toValue = action.value;
        this.model.toValue = action.value;
        break;
      case 'SET_FROM_VALUE': 
        this.fromValue = action.value;
        this.model.fromValue = action.value;
        break;
      default:
        this._state;
    }
  }
}