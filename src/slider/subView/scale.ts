interface IScale {
  toThumbPosition: number,
  fromThumbPosition?: number,
  render(): JQuery,
  handleScaleMousedown(e: JQuery.Event): void,
}

type ScaleArgs = {
  step: number,
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
};

export default class Scale implements IScale {
  private _$scale: JQuery = $('<div class="mi-slider__scale"></div>');

  private _isSingle: boolean;

  private _scaleNumbersArr: Array<number> = [];

  private min: number;

  private max: number;

  private step: number;

  public fromThumbPosition?: number;

  public toThumbPosition: number;

  private _setFromThumb?: (e: JQuery.Event) => void;

  private _setFromThumbActive?: (value: boolean) => void;

  private _setToThumb: (e: JQuery.Event) => void;

  private _setToThumbActive: (value: boolean) => void;

  private _isVertical?: boolean;

  constructor({
    step,
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
    this._isVertical = isVertical;

    if (this._isVertical) {
      this._$scale.addClass('mi-slider__scale_vertical');
    }

    this.min = min;
    this.max = max;
    this.step = step;
    this.toThumbPosition = toThumbPosition;
    this.fromThumbPosition = fromThumbPosition;
    this._setToThumb = setToThumb;
    this._setToThumbActive = setToThumbActive;
    this._setFromThumb = setFromThumb;
    this._setFromThumbActive = setFromThumbActive;

    this._isSingle = !isRange;
    this._renderNums();
    this._onScaleClick();
  }

  public handleScaleMousedown(e: JQuery.Event): void {
    e.preventDefault();
    let offset: number;
    const scaleClientRect = this._$scale.get(0).getBoundingClientRect();

    if (this._isVertical) {
      offset = ((e.clientY - scaleClientRect.top) * 100) / this._$scale.height();
    } else {
      offset = ((e.clientX - scaleClientRect.left) * 100) / this._$scale.width();
    }

    if (offset > 100) {
      offset = 100;
    } else if (offset < 0) {
      offset = 0;
    }

    this._setClosestThumbPos(offset, e);
  }

  public render(): JQuery {
    return this._$scale;
  }

  private _onScaleClick(): void {
    this._$scale.on('mousedown', this.handleScaleMousedown.bind(this));
  }

  private _setClosestThumbPos(offset: number, e: JQuery.Event): void {
    const offsetFromThumb = Math.abs(offset - this.fromThumbPosition);
    const offsetToThumb = Math.abs(offset - (100 - this.toThumbPosition));
    const offsetFromThumbIsLess = offsetToThumb <= offsetFromThumb;

    if (offsetFromThumbIsLess || this._isSingle) {
      this._setToThumbActive(true);
      this._setToThumb(e);
      $(document).on('mousemove', this._setToThumb.bind(this));
      $(document).on('mouseup', this._onMouseUp.bind(this, 'to'));
    } else {
      this._setFromThumbActive(true);
      this._setFromThumb(e);
      $(document).on('mousemove', this._setFromThumb.bind(this));
      $(document).on('mouseup', this._onMouseUp.bind(this, 'from'));
    }
  }

  private _onMouseUp(thumb: 'from' | 'to') {
    if (thumb === 'from') {
      this._setFromThumbActive(false);
    } else {
      this._setToThumbActive(false);
    }

    $(document).off('mousemove');
  }

  private _renderNums() {
    let maxNumsCount = Math.ceil((this.max - this.min) / this.step) + 1;

    if (maxNumsCount < 2) {
      maxNumsCount = 2;
    } else if (maxNumsCount > 100) {
      maxNumsCount = 101;
    }

    const scaleStep = (this.max - this.min) / (maxNumsCount - 1); 

    for (let i = 0; i < maxNumsCount; i += 1) {
      if (i === 0) {
        this._scaleNumbersArr[i] = this.min;
      } else if (i === maxNumsCount - 1) {
        this._scaleNumbersArr[i] = this.max;
      } else {
        this._scaleNumbersArr[i] = Number((this._scaleNumbersArr[i - 1] + scaleStep).toFixed(1));
      }

      const newEl = $('<span class="mi-slider__scale-graduation"></span>');
      const visibleLabelNumber = Math.round((maxNumsCount - 1) / 10);

      if (maxNumsCount > 10 && (i % visibleLabelNumber === 0) && i !== maxNumsCount - 2) {
        newEl.attr('data-before', `${this._scaleNumbersArr[i]}`);
        newEl.addClass('mi-slider__scale-graduation_numbered')
      } else if (maxNumsCount <= 10) {
        newEl.attr('data-before', `${this._scaleNumbersArr[i]}`);
      }
      if (i === maxNumsCount - 1) {
        newEl.attr('data-before', `${this._scaleNumbersArr[i]}`);
      }

      this._$scale.append(newEl);
    }
  }
}
