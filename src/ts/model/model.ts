import Observer from '../pattern/observer';

export interface IModel {
  min: number,
  max: number,
  fromValue: number,
  toValue: number,
  step: number,
  updateFromValue(value: number): void;
  updateToValue(value: number): void;
}

export default class Model extends Observer implements IModel {
  private _fromValue: number;

  private _toValue: number;

  private _min: number;

  private _max: number;

  private _step: number;

  constructor({
    min,
    max,
    from,
    to,
    step,
  }: {
    min: number,
    max: number,
    from?: number,
    to?: number,
    step?: number,
  }) {
    super();

    if (min < max) {
      this._min = min;
      this._max = max;
    } else if (min === max) {
      this._min = max - 1;
      this._max = max;
    } else {
      this._min = max;
      this._max = min;
    }

    if (typeof step === 'undefined') {
      this._step = 1;
    } else if (typeof step === 'number' && step > this._max - this._min) {
      this._step = this._max - this._min;
    } else {
      this._step = step;
    }

    if (typeof to !== 'undefined' && to > this._min && to <= this._max) {
      this._toValue = to;
    } else {
      this._toValue = this._max;
    }

    if (typeof from !== 'undefined' && from >= this._min && from < this._toValue) {
      this._fromValue = from;
    } else {
      this._fromValue = this._min;
    }
  }

  public updateFromValue(value: number): void {
    this.fire({ type: 'UPDATE_MODEL_FROM', value });
  }

  public updateToValue(value: number): void {
    this.fire({ type: 'UPDATE_MODEL_TO', value });
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

  public get min(): number {
    return this._min;
  }

  public get max(): number {
    return this._max;
  }

  public get step(): number {
    return this._step;
  }
}
