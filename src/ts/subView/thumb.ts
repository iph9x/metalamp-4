import Label from './label';
import ProgressBar from './progressBar';
import Observer from '../pattern/observer';

export interface IThumb {
  setPositionHandler(e: JQuery.Event): void,
  setPositionByValue(value: number): void,
  setIsActive(value: boolean): void,
  render(): JQuery,
  otherThumbPosition?: number
}

type ThumbArgs = {
  type: 'fromThumb' | 'toThumb';
  startPosition?: number;
  label?: Label;
  step?: number;
  wrapper: JQuery;
  progressBar: ProgressBar;
  max: number;
  min: number;
  otherThumbPosition?: number;
  vertical?: boolean;
  isRange?: boolean;
};

export default class Thumb extends Observer implements IThumb {
  private _$thumb: JQuery = $('<span class="mi-slider__thumb"></span>');

  private _shift: number = 0;

  private _isActive: boolean = false;

  private _current: number;

  private _isMaxThumb: boolean;

  private _position: number;

  private _type: 'fromThumb' | 'toThumb';

  private _label: Label;

  private _step: number;

  private _$wrapper: JQuery;

  private _progressBar: ProgressBar;

  private _max: number;

  private _min: number;

  private _isVertical?: boolean;

  private _isRange?: boolean;

  private cssType: string;

  public otherThumbPosition?: number;

  constructor({
    type,
    startPosition,
    label,
    step = 1,
    wrapper,
    progressBar,
    max,
    min,
    otherThumbPosition,
    vertical,
    isRange,
  }: ThumbArgs) {
    super();

    this._type = type;
    this._label = label;
    this._step = step;
    this._$wrapper = wrapper;
    this._progressBar = progressBar;
    this._max = max;
    this._min = min;
    this.otherThumbPosition = otherThumbPosition;
    this._isVertical = vertical;
    this._isRange = isRange;

    if (this._type === 'fromThumb') {
      this.cssType = this._isVertical ? 'top' : 'left';
    } else {
      this.cssType = this._isVertical ? 'bottom' : 'right';
    }

    this._$thumb.addClass(`mi-slider__thumb_${this.cssType}`);
    this._isMaxThumb = this._type === 'toThumb';

    this._current = this._isMaxThumb ? max : min;

    this.setPositionByValue(startPosition);

    this._onThumbClick();
    this._onThumbMouseUp();

    this.setPositionHandler = this.setPositionHandler.bind(this);
    this._calcNewPosition = this._calcNewPosition.bind(this);
    this.setIsActive = this.setIsActive.bind(this);
  }

  private _onThumbClick() {
    this._$thumb.on('mousedown', (e: JQuery.Event) => this.clickHandler(e));
  }

  private _onThumbMove() {
    $(document).on('mousemove', (e: JQuery.Event) => this.setPositionHandler(e));
  }

  private _calcValueFromPosition(position: number): number {
    const minMaxDiff = this._max - this._min;
    if (position === 1 || position === 0) {
      return (this._min + (position) * minMaxDiff);
    }
    return (Math.round((this._min + (position) * minMaxDiff) / this._step) * this._step);
  }

  private _onThumbMouseUp(): void {
    $(document).on('mouseup', () => this._mouseupHandler());
  }

  private _mouseupHandler(): void {
    if (this._isActive) {
      this.setIsActive(false);

      $('html').css('cursor', 'default');
      $(document).off('mousemove');

      this._shift = 0;
    }
  }

  private _getValueToPercent(value: number): number {
    return (value / (this._max - this._min)) * 100;
  }

  private _calcShift(
    mousePos: number,
    type: 'top' | 'left',
    dimension: 'width' | 'height',
  ): number {
    const thumbOffset = this._$thumb.get(0).getBoundingClientRect()[type];
    return mousePos - thumbOffset - (this._$thumb[dimension]() / 2);
  }

  private _calcNewPosition(
    mousePos: number,
    type: 'left' | 'top',
    dimension: 'height' | 'width',
  ): number {
    const wrapperOffset = this._$wrapper.get(0).getBoundingClientRect()[type];
    return ((mousePos - this._shift - wrapperOffset) * 100) / this._$wrapper[dimension]();
  }

  private _checkBorders(position: number, border: number): number {
    const stepInPercent = this._getValueToPercent(this._step);
    if (typeof this._isRange !== 'undefined' && !this._isRange) {
      if (position < 0) {
        return 0;
      }
      if (position > 100) {
        return 100;
      }
      return position;
    }
    if (position < 0) {
      return 0;
    }
    if (Number((position).toFixed(8)) >= Number((100 - border - stepInPercent).toFixed(8))) {
      if (100 - border - stepInPercent < 0) {
        return 0;
      }
      return 100 - border - stepInPercent;
    }
    if (position > 100) {
      return 100;
    }
    return position;
  }

  private _setCurrent(value: number): void {
    const roundedValue = Number(value.toFixed(6));
    this._current = roundedValue;
    this._setParentState('SET_CURRENT_MAX', 'SET_CURRENT_MIN', roundedValue);
  }

  private _setParentState(
    typeOfMaxThumb: string,
    typeOfMinThumb: string,
    value: boolean | number,
  ): void {
    this.fire({ type: this._isMaxThumb ? typeOfMaxThumb : typeOfMinThumb, value });
  }

  private _setPosition(value: number) {
    this._position = value;
    this._setParentState('SET_TO_THUMB_POSITION', 'SET_FROM_THUMB_POSITION', value);
  }

  public clickHandler(e: JQuery.Event): void {
    e.preventDefault();

    this.setIsActive(true);
    this._shift = this._isVertical ? this._calcShift(e.clientY, 'top', 'height') : this._calcShift(e.clientX, 'left', 'width');
    $('html').css('cursor', 'pointer');

    this._onThumbMove();
  }

  public render(): JQuery {
    return this._$thumb;
  }

  public setPositionByValue(value: number): void {
    const roundedValue = Number(value.toFixed(6));

    if (roundedValue < this._min) {
      this._position = 0;
    } else if (roundedValue > this._max) {
      this._position = 100;
    } else if (this._isMaxThumb) {
      this._position = this._getValueToPercent(this._max - roundedValue);
    } else {
      this._position = 100 - this._getValueToPercent(this._max - roundedValue);
    }

    this._setCurrent(roundedValue);
    this._setPosition(this._position);
    this._$thumb.css(this.cssType, `${this._position}%`);

    if (this._isMaxThumb) {
      this._progressBar.setToPosition(this._position);
    } else {
      this._progressBar.setFromPosition(this._position);
    }

    this._label?.setPosition(this._position);
    this._label?.setValue(roundedValue);
  }

  public setIsActive(value: boolean): void {
    this._isActive = value;
  }

  public setPositionHandler(e: JQuery.Event): void {
    if (!this._isActive) return;

    const calcedX: number = this._calcNewPosition(e.clientX, 'left', 'width');
    const calcedY: number = this._calcNewPosition(e.clientY, 'top', 'height');
    let newPosition: number;

    if (this._isMaxThumb) {
      newPosition = this._isVertical ? 100 - calcedY : 100 - calcedX;
    } else {
      newPosition = this._isVertical ? calcedY : calcedX;
    }

    newPosition = this._checkBorders(newPosition, this.otherThumbPosition);

    if (this._isMaxThumb) {
      this._progressBar.setToPosition(newPosition);
      let value = this._calcValueFromPosition(1 - newPosition / 100);
      value = value > this._max ? this._max : value;

      const roundedValue = Number(value.toFixed(6));
      this._current = roundedValue;
      this.fire({ type: 'SET_CURRENT_MAX', value: roundedValue });
    } else {
      this._progressBar.setFromPosition(newPosition);
      let value = this._calcValueFromPosition(newPosition / 100);
      value = value < this._min ? this._min : value;

      const roundedValue = Number(value.toFixed(6));
      this._current = roundedValue;
      this.fire({ type: 'SET_CURRENT_MIN', value: roundedValue });
    }

    this._$thumb.css(this.cssType, `${newPosition}%`);
    this._label?.setPosition(newPosition);
    this._label?.setValue(this._current);

    this._setPosition(newPosition);
  }
}
