export interface ModelInterface {
  max: number;
  min?: number;
}

export default class Model implements ModelInterface {
  public max: number;
  public min?: number;
  public currentMin: number;
  public currentMax: number;

  constructor(max: number, min?: number) {
    this.max = max;
    this.setCurrentMax(max);
    if (min) {
      this.min = min;
      this.setCurrentMin(min);
    }
  }

  setCurrentMin(currentMin: number) {
    this.currentMin = currentMin;
  }

  setCurrentMax(currentMax: number) {
    this.currentMax = currentMax;
  }



}