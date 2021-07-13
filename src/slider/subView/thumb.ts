import Observer from '../pattern/observer';
import Label from './label';
import ProgressBar from './progressBar';

interface IThumb {
  handleThumbMove(e: JQuery.Event): void,
  setPositionByValue(value: number): void,
  setIsActive(value: boolean): void,
  render(): JQuery,
  otherThumbPosition?: number,
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

    this._$thumb.addClass(`mi-slider__thumb_position_${this.cssType}`);
    this._isMaxThumb = this._type === 'toThumb';

    this._current = this._isMaxThumb ? max : min;

    this.setPositionByValue(startPosition);

    this._onThumbMousedown();
    this._onThumbMouseup();

    this.handleThumbMove = this.handleThumbMove.bind(this);
    this.setIsActive = this.setIsActive.bind(this);
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

  public handleThumbMove(e: JQuery.Event): void {
    if (!this._isActive) return;

    const calcedOffset: number = this._isVertical
      ? this._calcNewPosition(e.clientY, 'top', 'height')
      : this._calcNewPosition(e.clientX, 'left', 'width');
    let newPosition = this._isMaxThumb ? 100 - calcedOffset : calcedOffset;

    newPosition = this._checkBorders(newPosition, this.otherThumbPosition);

    if (this._isMaxThumb) {
      let value = this._calcValueFromPosition(1 - newPosition / 100);

      value = value > this._max ? this._max : value;

      const roundedValue = Number(value.toFixed(6));

      this._current = roundedValue;
      this._progressBar.setToPosition(newPosition);
      this.fire({ type: 'SET_CURRENT_MAX', value: roundedValue });
    } else {
      let value = this._calcValueFromPosition(newPosition / 100);

      value = value < this._min ? this._min : value;

      const roundedValue = Number(value.toFixed(6));

      this._current = roundedValue;
      this._progressBar.setFromPosition(newPosition);
      this.fire({ type: 'SET_CURRENT_MIN', value: roundedValue });
    }

    this._$thumb.css(this.cssType, `${newPosition}%`);
    this._label?.setPosition(newPosition);
    this._label?.setValue(this._current);

    this._setPosition(newPosition);
  }

  public update(action: { type: string, value: JQuery.Event }): void {
    const { type, value } = action;

    switch (type) {
      case ('ACTIVATE_THUMB'):
        this._handleThumbMousedown(value);
        break;
      case ('DISABLE_THUMB'):
        this._handleThumbMouseup();
        break;
      default:
        break;
    }
  }

  private _onThumbMousedown() {
    this._$thumb.on('mousedown', this._handleThumbMousedown.bind(this));
  }

  private _onThumbMove() {
    $(document).on('mousemove', this.handleThumbMove.bind(this));
  }

  private _onThumbMouseup(): void {
    $(document).on('mouseup', this._handleThumbMouseup.bind(this));
  }

  private _handleThumbMousedown(e: JQuery.Event): void {
    e.preventDefault();

    $(document)
      .css('-moz-user-select', 'none')
      .css('-khtml-user-select', 'none')
      .css('-webkit-user-select', 'none')
      .css('user-select', 'none');

    this.setIsActive(true);
    this._shift = this._isVertical
      ? this._calcShift(e.clientY, 'top', 'height')
      : this._calcShift(e.clientX, 'left', 'width');

    $('html').css('cursor', 'pointer');

    this._onThumbMove();
  }

  private _handleThumbMouseup(): void {
    if (this._isActive) {
      this.setIsActive(false);

      $(document)
        .css('-moz-user-select', 'auto')
        .css('-khtml-user-select', 'auto')
        .css('-webkit-user-select', 'auto')
        .css('user-select', 'auto');
      $('html').css('cursor', 'default');
      $(document).off('mousemove');

      this._shift = 0;
    }
  }

  private _calcValueFromPosition(position: number): number {
    const minMaxDiff = this._max - this._min;

    return this._min + position * minMaxDiff;
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
    const wrapperSize = this._$wrapper[dimension]();
    const thumbOffset = ((mousePos - this._shift - wrapperOffset) * 100) / wrapperSize;
    const stepInPercent = this._getValueToPercent(this._step);

    return Math.round(thumbOffset / stepInPercent) * stepInPercent;
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
}
