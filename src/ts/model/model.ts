export interface IModel {
  fromValue: number;
  toValue: number;
}

export default class Model implements IModel {
  constructor(
    private _toValue: number,
    private _fromValue: number,
  ) {
    if (typeof _fromValue === 'undefined') {
      this._fromValue = 0;
    }
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
