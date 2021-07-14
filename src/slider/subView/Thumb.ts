import Observer from '../pattern/Observer';
import Label from './Label';
import ProgressBar from './ProgressBar';

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
  private $thumb: JQuery = $('<span class="mi-slider__thumb"></span>');

  private shift: number = 0;

  private isActive: boolean = false;

  private current: number;

  private isMaxThumb: boolean;

  private position: number;

  private type: 'fromThumb' | 'toThumb';

  private label: Label;

  private step: number;

  private $wrapper: JQuery;

  private progressBar: ProgressBar;

  private max: number;

  private min: number;

  private isVertical?: boolean;

  private isRange?: boolean;

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

    this.type = type;
    this.label = label;
    this.step = step;
    this.$wrapper = wrapper;
    this.progressBar = progressBar;
    this.max = max;
    this.min = min;
    this.otherThumbPosition = otherThumbPosition;
    this.isVertical = vertical;
    this.isRange = isRange;

    if (this.type === 'fromThumb') {
      this.cssType = this.isVertical ? 'top' : 'left';
    } else {
      this.cssType = this.isVertical ? 'bottom' : 'right';
    }

    this.$thumb.addClass(`mi-slider__thumb_position_${this.cssType}`);
    this.isMaxThumb = this.type === 'toThumb';

    this.current = this.isMaxThumb ? max : min;

    this.setPositionByValue(startPosition);

    this.onThumbMousedown();
    this.onThumbMouseup();

    this.handleThumbMove = this.handleThumbMove.bind(this);
    this.setIsActive = this.setIsActive.bind(this);
  }

  public render(): JQuery {
    return this.$thumb;
  }

  public setPositionByValue(value: number): void {
    const roundedValue = Number(value.toFixed(6));

    if (roundedValue < this.min) {
      this.position = 0;
    } else if (roundedValue > this.max) {
      this.position = 100;
    } else if (this.isMaxThumb) {
      this.position = this.getValueToPercent(this.max - roundedValue);
    } else {
      this.position = 100 - this.getValueToPercent(this.max - roundedValue);
    }

    this.setCurrent(roundedValue);
    this.setPosition(this.position);
    this.$thumb.css(this.cssType, `${this.position}%`);

    if (this.isMaxThumb) {
      this.progressBar.setToPosition(this.position);
    } else {
      this.progressBar.setFromPosition(this.position);
    }

    this.label?.setPosition(this.position);
    this.label?.setValue(roundedValue);
  }

  public setIsActive(value: boolean): void {
    this.isActive = value;
  }

  public handleThumbMove(e: JQuery.Event): void {
    if (!this.isActive) return;

    const calcedOffset: number = this.isVertical
      ? this.calcNewPosition(e.clientY, 'top', 'height')
      : this.calcNewPosition(e.clientX, 'left', 'width');
    let newPosition = this.isMaxThumb ? 100 - calcedOffset : calcedOffset;

    newPosition = this.checkBorders(newPosition, this.otherThumbPosition);

    if (this.isMaxThumb) {
      let value = this.calcValueFromPosition(1 - newPosition / 100);

      value = value > this.max ? this.max : value;

      const roundedValue = Number(value.toFixed(6));

      this.current = roundedValue;
      this.progressBar.setToPosition(newPosition);
      this.fire({ type: 'SET_CURRENT_MAX', value: roundedValue });
    } else {
      let value = this.calcValueFromPosition(newPosition / 100);

      value = value < this.min ? this.min : value;

      const roundedValue = Number(value.toFixed(6));

      this.current = roundedValue;
      this.progressBar.setFromPosition(newPosition);
      this.fire({ type: 'SET_CURRENT_MIN', value: roundedValue });
    }

    this.$thumb.css(this.cssType, `${newPosition}%`);
    this.label?.setPosition(newPosition);
    this.label?.setValue(this.current);

    this.setPosition(newPosition);
  }

  public update(action: { type: string, value: JQuery.Event }): void {
    const { type, value } = action;

    switch (type) {
      case ('ACTIVATE_THUMB'):
        this.handleThumbMousedown(value);
        break;
      case ('DISABLE_THUMB'):
        this.handleThumbMouseup();
        break;
      default:
        break;
    }
  }

  private onThumbMousedown() {
    this.$thumb.on('mousedown', this.handleThumbMousedown.bind(this));
  }

  private onThumbMove() {
    $(document).on('mousemove', this.handleThumbMove.bind(this));
  }

  private onThumbMouseup(): void {
    $(document).on('mouseup', this.handleThumbMouseup.bind(this));
  }

  private handleThumbMousedown(e: JQuery.Event): void {
    e.preventDefault();

    $(document)
      .css('-moz-user-select', 'none')
      .css('-khtml-user-select', 'none')
      .css('-webkit-user-select', 'none')
      .css('user-select', 'none');

    this.setIsActive(true);
    this.shift = this.isVertical
      ? this.calcShift(e.clientY, 'top', 'height')
      : this.calcShift(e.clientX, 'left', 'width');

    $('html').css('cursor', 'pointer');

    this.onThumbMove();
  }

  private handleThumbMouseup(): void {
    if (this.isActive) {
      this.setIsActive(false);

      $(document)
        .css('-moz-user-select', 'auto')
        .css('-khtml-user-select', 'auto')
        .css('-webkit-user-select', 'auto')
        .css('user-select', 'auto');
      $('html').css('cursor', 'default');
      $(document).off('mousemove');

      this.shift = 0;
    }
  }

  private calcValueFromPosition(position: number): number {
    const minMaxDiff = this.max - this.min;

    return this.min + position * minMaxDiff;
  }

  private getValueToPercent(value: number): number {
    return (value / (this.max - this.min)) * 100;
  }

  private calcShift(
    mousePos: number,
    type: 'top' | 'left',
    dimension: 'width' | 'height',
  ): number {
    const thumbOffset = this.$thumb.get(0).getBoundingClientRect()[type];
    return mousePos - thumbOffset - (this.$thumb[dimension]() / 2);
  }

  private calcNewPosition(
    mousePos: number,
    type: 'left' | 'top',
    dimension: 'height' | 'width',
  ): number {
    const wrapperOffset = this.$wrapper.get(0).getBoundingClientRect()[type];
    const wrapperSize = this.$wrapper[dimension]();
    const thumbOffset = ((mousePos - this.shift - wrapperOffset) * 100) / wrapperSize;
    const stepInPercent = this.getValueToPercent(this.step);

    return Math.round(thumbOffset / stepInPercent) * stepInPercent;
  }

  private checkBorders(position: number, border: number): number {
    const stepInPercent = this.getValueToPercent(this.step);
    if (typeof this.isRange !== 'undefined' && !this.isRange) {
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

  private setCurrent(value: number): void {
    const roundedValue = Number(value.toFixed(6));
    this.current = roundedValue;
    this.setParentState('SET_CURRENT_MAX', 'SET_CURRENT_MIN', roundedValue);
  }

  private setParentState(
    typeOfMaxThumb: string,
    typeOfMinThumb: string,
    value: boolean | number,
  ): void {
    this.fire({ type: this.isMaxThumb ? typeOfMaxThumb : typeOfMinThumb, value });
  }

  private setPosition(value: number) {
    this.position = value;
    this.setParentState('SET_TO_THUMB_POSITION', 'SET_FROM_THUMB_POSITION', value);
  }
}
