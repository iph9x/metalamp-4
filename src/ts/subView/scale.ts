export interface IScale {
  toThumbPosition: number,
  fromThumbPosition?: number,
  render(): JQuery,
  clickHandler(e: JQuery.Event): void,
}

type ScaleArgs = {
  min: number,
  max: number,
  fromThumbPosition: number,
  toThumbPosition: number,
  setFromThumb?: (e: JQuery.Event) => void,
  setFromThumbActive?: (value: boolean) => void,
  setToThumb: (e: JQuery.Event) => void,
  setToThumbActive: (value: boolean) => void,
  isRange?: boolean,
  isVertical?: boolean,
}

export default class Scale implements IScale {
  private _scale: JQuery = $('<div class="mi-slider__scale"></div>');

  private _isSingle: boolean;

  private _scaleNumbersArr: Array<number> = [];

  public fromThumbPosition?: number;

  public toThumbPosition: number;
  
  private _setFromThumb?: (e: JQuery.Event) => void;

  private _setFromThumbActive?: (value: boolean) => void;

  private _setToThumb: (e: JQuery.Event) => void;
  
  private _setToThumbActive: (value: boolean) => void;

  private _isVertical?: boolean;

  constructor({
    min,
    max,
    toThumbPosition,
    setToThumb,
    setToThumbActive,
    fromThumbPosition,
    setFromThumb,
    isVertical,
    setFromThumbActive,
    isRange,
  }: ScaleArgs) {
    const scaleStep = (max - min) / 4;
    this._isVertical = isVertical;

    if (this._isVertical) {
      this._scale.addClass('mi-slider__scale_vertical');
    }
    this.toThumbPosition = toThumbPosition;
    this.fromThumbPosition = fromThumbPosition;
    this._setToThumb = setToThumb;
    this._setToThumbActive = setToThumbActive;
    this._setFromThumb = setFromThumb;
    this._setFromThumbActive = setFromThumbActive;

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
    this._renderNums();
    this._onScaleClick();
  }

  private _onScaleClick(): void {
    this._scale.on('mousedown', (e: JQuery.Event) => this.clickHandler(e));
  }

  private _setClosestThumbPos(offset: number, e: JQuery.Event): void {
    const offsetFromThumb = Math.abs(offset - this.fromThumbPosition);
    const offsetToThumb = Math.abs(offset - (100 - this.toThumbPosition));
    const offsetFromThumbIsLess = offsetToThumb <= offsetFromThumb;
    
    if (offsetFromThumbIsLess || this._isSingle) {
      this._setToThumbActive(true);
      this._setToThumb(e);
      this._setToThumbActive(false);
    } else {
      this._setFromThumbActive(true);
      this._setFromThumb(e);
      this._setFromThumbActive(false);
    }
  }

  private _renderNums() {
    for (let i = 0; i < 5; i += 1) {
      const newEl = $('<span class="mi-slider__scale-num"></span>');
      newEl.attr('data-before', `${this._scaleNumbersArr[i]}`);
      this._scale.append(newEl);
    }
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

  public render(): JQuery {
    return this._scale;
  }
}
