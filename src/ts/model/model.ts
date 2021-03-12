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
    this.setCurrentMax = max;
    if (min) {
      this.setMin = min;
      this.setCurrentMin = min;
    }
  }

  public set setMax(max: number) {
    this.max = max;
  }

  public set setMin(min: number) {
    this.min = min;
  }

  public set setCurrentMin(currentMin: number) {
    this.currentMin = currentMin;
  }

  public set setCurrentMax(currentMax: number) {
    this.currentMax = currentMax;
  }
}