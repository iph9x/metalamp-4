import Observer from '../pattern/observer';

export interface IModel {
  fromValue: number,
  toValue: number,
  updateFromValue(value: number): void;
  updateToValue(value: number): void;
}

export default class Model extends Observer implements IModel {
  constructor(
    private _fromValue: number,
    private _toValue: number,
  ) {
    super();
  }

  public updateFromValue(value: number): void {
    this.init({ type: 'UPDATE_MODEL_FROM', value });
  }

  public updateToValue(value: number): void {
    this.init({ type: 'UPDATE_MODEL_TO', value });
  }

  public set fromValue(value: number) {
    this._fromValue = value;
  }

  public set toValue(value: number) {
    this._toValue = value;
  }

  public get fromValue(): number {
    return this._fromValue;
  }

  public get toValue(): number {
    return this._toValue;
  }
}
