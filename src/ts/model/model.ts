export interface IModel {
  max: number;
  min?: number;
}

export default class Model implements IModel {
  // public currentMin: number;
  // public currentMax: number;

  constructor(public max: number, public min?: number) {
    // this.setCurrentMax = max;
    if (typeof min === 'undefined') {
      this.setMin = 0;
      // this.setCurrentMin = min;
    }
  }

  public set setMax(max: number) {
    this.max = max;
  }

  public set setMin(min: number) {
    this.min = min;
  }

  // public set setCurrentMin(currentMin: number) {
  //   this.currentMin = currentMin;
  // }

  // public set setCurrentMax(currentMax: number) {
  //   this.currentMax = currentMax;
  // }
}