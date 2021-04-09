export interface IScale {
  maxThumbPosition: number,
  minThumbPosition?: number,
  setMax: Function,
  setMin?: Function,
  vertical?: boolean,
}

export default class Scale implements IScale {
  private scale: JQuery = $(`<div class="mi-slider__scale"></div>`);
  private isSingle: boolean;
  private scaleNumbersArr: Array<number> = [];
  private scaleElementsArr: Array<JQuery> = [];

  constructor(
    min: number,
    max: number,
    public maxThumbPosition: number,
    public setMax: Function,
    public setMaxActive: (value: boolean) => void,
    public minThumbPosition?: number,
    public setMin?: Function,
    public vertical?: boolean,
    public setMinActive?: (value: boolean) => void,
    public isRange?: boolean,
  ) {
    if (this.vertical) {
      this.scale.addClass(`mi-slider__scale_vertical`);
    }

    let scaleStep = (max - min) / 4;

    for (let i = 0; i < 5; i += 1) {
      if (i === 0) {
        this.scaleNumbersArr[i] = min;
      } else if (i === 4) {
        this.scaleNumbersArr[i] = max;
      } else {
        this.scaleNumbersArr[i] = Number((this.scaleNumbersArr[i - 1] + scaleStep).toFixed(1));
      }
    }

    this.scaleElementsArr = this.scaleNumbersArr.map((el) => {
      return $(`<span class="mi-slider__scale-num"></span>`)
    })
    
    this.isSingle = !isRange
    this.render();
    this.onScaleClick();
  }

  private onScaleClick(): void {
    this.scale.on('mousedown', (e: JQuery.Event) => this.clickHandler(e))
  }

  public clickHandler(e: JQuery.Event): void {
    let offset: number;
    if (this.vertical) {
      offset = (e.pageY - this.scale.get(0).getBoundingClientRect().top ) * 100 / this.scale.height();
    } else {
      offset = (e.pageX - this.scale.get(0).getBoundingClientRect().left ) * 100 / this.scale.width();
    }

    if (offset > 100) {
      offset = 100;
    } else if (offset < 0) {
      offset = 0;
    }

    this.setClosestThumbPos(offset, e);
  }

  private setClosestThumbPos(offset: number, e: JQuery.Event): void {
    let offsetMin = Math.abs(offset - this.minThumbPosition);
    let offsetMax = Math.abs(offset - (100 - this.maxThumbPosition));

    if (offsetMax <= offsetMin || this.isSingle) {
      this.setMaxActive(true);
      this.setMax(e);
      this.setMaxActive(false);
    } else {
      this.setMinActive(true);
      this.setMin(e);
      this.setMinActive(false);
    }
  }

  public render() {
    for (let i = 0; i < 5; i += 1) {
      let newEl = this.scaleElementsArr[i];
      newEl.attr('data-before', `${this.scaleNumbersArr[i]}`)
      this.scale.append(newEl);
    }

    return this.scale;
  }
}