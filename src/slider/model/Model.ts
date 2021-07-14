import Observer from '../pattern/Observer';

interface IModel {
  getMin(): number,
  getMax(): number,
  setFromValue(value: number): void,
  setToValue(value: number): void,
  getFromValue(): number,
  getToValue(): number,
  getStep(): number,
  updateFromValue(value: number): void,
  updateToValue(value: number): void,
}

export default class Model extends Observer implements IModel {
  private fromValue: number;

  private toValue: number;

  private min: number;

  private max: number;

  private step: number;

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

    this.validateMinMax(min, max);
    this.validateStep(step);
    this.validateToValue(to);
    this.validateFromValue(from);
  }

  public updateFromValue(value: number): void {
    this.fire({ type: 'UPDATE_MODEL_FROM', value });
  }

  public updateToValue(value: number): void {
    this.fire({ type: 'UPDATE_MODEL_TO', value });
  }

  public setFromValue(value: number) {
    this.fromValue = value;
  }

  public setToValue(value: number) {
    this.toValue = value;
  }

  public getFromValue(): number {
    return this.fromValue;
  }

  public getToValue(): number {
    return this.toValue;
  }

  public getMin(): number {
    return this.min;
  }

  public getMax(): number {
    return this.max;
  }

  public getStep(): number {
    return this.step;
  }

  private validateMinMax(min: number, max: number) {
    if (min < max) {
      this.min = min;
      this.max = max;
    } else if (min === max) {
      this.min = max - 1;
      this.max = max;
    } else {
      this.min = max;
      this.max = min;
    }
  }

  private validateStep(step: number) {
    if (typeof step === 'undefined') {
      this.step = 1;
    } else if (typeof step === 'number' && step > this.max - this.min) {
      this.step = this.max - this.min;
    } else {
      this.step = step;
    }
  }

  private validateToValue(to: number) {
    const isToValueInRange = (to > this.min) && (to <= this.max);
    if (typeof to !== 'undefined' && isToValueInRange) {
      this.toValue = to;
    } else {
      this.toValue = this.max;
    }
  }

  private validateFromValue(from: number) {
    const isFromValueInRange = from >= this.min && from < this.toValue;
    if (typeof from !== 'undefined' && isFromValueInRange) {
      this.fromValue = from;
    } else {
      this.fromValue = this.min;
    }
  }
}
