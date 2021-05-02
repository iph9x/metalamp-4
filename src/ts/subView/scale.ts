export interface IScale {
  render(): JQuery,
  clickHandler(e: JQuery.Event): void,
}

export default class Scale implements IScale {
  private _scale: JQuery = $('<div class="mi-slider__scale"></div>');

  private _isSingle: boolean;

  private _scaleNumbersArr: Array<number> = [];

  constructor(
    min: number,
    max: number,
    public maxThumbPosition: number,
    private _setMax: (e: JQuery.Event) => void,
    private _setMaxActive: (value: boolean) => void,
    public minThumbPosition?: number,
    private _setMin?: (e: JQuery.Event) => void,
    private _isVertical?: boolean,
    private _setMinActive?: (value: boolean) => void,
    isRange?: boolean,
  ) {
    const scaleStep = (max - min) / 4;

    if (this._isVertical) {
      this._scale.addClass('mi-slider__scale_vertical');
    }

    for (let i = 0; i < 5; i += 1) {
      if (i === 0) {
        this._scaleNumbersArr[i] = min;
      } else if (i === 4) {
        this._scaleNumbersArr[i] = max;
      } else {
        this._scaleNumbersArr[i] = Number((this._scaleNumbersArr[i - 1] + scaleStep).toFixed(1));
      }
    }

    this._isSingle = !isRange;
    this.renderNums();
    this._onScaleClick();
  }

  private _onScaleClick(): void {
    this._scale.on('mousedown', (e: JQuery.Event) => this.clickHandler(e));
  }

  public clickHandler(e: JQuery.Event): void {
    let offset: number;
    const scaleClientRect = this._scale.get(0).getBoundingClientRect();

    if (this._isVertical) {
      offset = ((e.clientY - scaleClientRect.top) * 100) / this._scale.height();
    } else {
      offset = ((e.clientX - scaleClientRect.left) * 100) / this._scale.width();
    }

    if (offset > 100) {
      offset = 100;
    } else if (offset < 0) {
      offset = 0;
    }

    this._setClosestThumbPos(offset, e);
  }

  private _setClosestThumbPos(offset: number, e: JQuery.Event): void {
    const offsetMin = Math.abs(offset - this.minThumbPosition);
    const offsetMax = Math.abs(offset - (100 - this.maxThumbPosition));

    if (offsetMax <= offsetMin || this._isSingle) {
      this._setMaxActive(true);
      this._setMax(e);
      this._setMaxActive(false);
    } else {
      this._setMinActive(true);
      this._setMin(e);
      this._setMinActive(false);
    }
  }

  public render(): JQuery {
    return this._scale;
  }

  private renderNums() {
    for (let i = 0; i < 5; i += 1) {
      const newEl = $('<span class="mi-slider__scale-num"></span>');
      newEl.attr('data-before', `${this._scaleNumbersArr[i]}`);
      this._scale.append(newEl);
    }
  }
}
