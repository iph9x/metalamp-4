import Label from '../subView/label';
import Thumb from '../subView/thumb';
import ProgressBar from '../subView/progressBar';
import Scale from '../subView/scale';
import Observer from '../pattern/observer';

interface IView {
  setStep(value: number): void,
  setMin(value: number): void,
  setMax(value: number): void,
  getFrom(): number,
  getTo(): number,
  setFrom(value: number): void,
  setTo(value: number): void,
  updateFrom(value: number): void,
  updateTo(value: number): void,
  update(action: { type: string, value: number }): void,
  run(): void,
}

type ViewArgs = {
  slider: JQuery,
  isRange?: boolean,
  hasLabels?: boolean,
  isVertical?: boolean,
  inputFromClass?: string,
  inputToClass?: string,
};

export default class View extends Observer implements IView {
  private _fromThumbPosition: number;

  private _toThumbPosition: number;

  private _$wrapper = $('<div class="mi-slider__wrapper"></div>');

  private _scale: Scale;

  private _progressBar: ProgressBar;

  private _fromThumb: Thumb;

  private _toThumb: Thumb;

  private _fromThumbLabel: Label;

  private _toThumbLabel: Label;

  private _$inputFrom: JQuery;

  private _$inputTo: JQuery;

  private _isVertical?: boolean;

  private _max: number;

  private _min: number;

  private _$slider: JQuery;

  private _isRange?: boolean;

  private _step?: number;

  private _from?: number;

  private _to?: number;

  private _hasLabels?: boolean;

  private _inputFromClass?: string;

  private _inputToClass?: string;

  constructor({
    slider,
    isRange,
    hasLabels,
    isVertical,
    inputFromClass,
    inputToClass,
  }: ViewArgs) {
    super();
    this._$slider = $(slider);
    this._isVertical = isVertical ?? false;
    this._isRange = isRange ?? true;
    this._inputFromClass = inputFromClass;
    this._inputToClass = inputToClass;
    this._hasLabels = hasLabels ?? true;
  }

  public run(): void {
    this._runConditionsBlock();

    const $slider = this._$slider;
    $slider.addClass('mi-slider');

    this._progressBar = new ProgressBar(this._isRange, this._isVertical);

    this._changeInputFromValue(this._from);
    this._changeInputToValue(this._to);

    this._fromThumbPosition = (1 - (this._max - this._from) / (this._max - this._min)) * 100;
    this._toThumbPosition = ((this._max - this._to) / (this._max - this._min)) * 100;

    this._toThumbLabel = this._createToLabel();
    this._fromThumbLabel = this._createFromLabel();

    if (this._isRange) {
      this._fromThumb = this._createFromThumb();
      this._fromThumb.subscribe(this);
      this._fromThumbLabel.subscribe(this._fromThumb);

      this._initInputFrom();
    }

    this._toThumb = this._createToThumb();
    this._toThumb.subscribe(this);
    this._toThumbLabel.subscribe(this._toThumb);

    this._scale = this._createScale();

    this._progressBar.onProgressBarMousedown(this._scale.handleScaleMousedown.bind(this._scale));

    this._initInputTo();
    this.render($slider);
  }

  public setMin(value: number) {
    this._min = value;
  }

  public setMax(value: number) {
    this._max = value;
  }

  public getTo(): number {
    return this._to;
  }

  public getFrom(): number {
    return this._from;
  }

  public setTo(value: number) {
    this._to = value;
  }

  public setFrom(value: number) {
    this._from = value;
  }

  public setStep(value: number) {
    this._step = value;
  }

  public updateFrom(value: number) {
    const newVal = this._checkNewFromValue(value);
    this._fromThumb.setPositionByValue(newVal);
  }

  public updateTo(value: number) {
    const newVal = this._checkNewToValue(value);
    this._toThumb.setPositionByValue(newVal);
  }

  public update(action: { type: string, value: number }): void {
    const { type, value } = action;

    switch (type) {
      case ('SET_CURRENT_MAX'):
        this._setCurrentMax(value);
        break;
      case ('SET_CURRENT_MIN'):
        this._setCurrentMin(value);
        break;
      case ('SET_TO_THUMB_POSITION'):
        this._toThumbPosition = value;
        if (this._isRange) {
          this._fromThumb.otherThumbPosition = value;
        }

        this._scale.toThumbPosition = value;
        break;
      case ('SET_FROM_THUMB_POSITION'):
        this._fromThumbPosition = value;
        this._toThumb.otherThumbPosition = value;
        this._scale.fromThumbPosition = value;
        break;
      default:
        break;
    }
  }

  private handleInputFromBlur(e: Event) {
    const val = this._checkNewFromValue(Number($(e.target).val()));
    this._fromThumb.setPositionByValue(val);
  }

  private _initInputFrom(): void {
    if (this._inputFromClass) {
      this._$inputFrom.off();
      this._$inputFrom.on('blur', this.handleInputFromBlur.bind(this));
    }
  }

  private handleInputToBlur(e: Event) {
    const val = this._checkNewToValue(Number($(e.target).val()));
    this._toThumb.setPositionByValue(val);
  }

  private _initInputTo(): void {
    if (this._$inputTo) {
      this._$inputTo.off();
      this._$inputTo.on('blur', this.handleInputToBlur.bind(this));
    }
  }

  private _runConditionsBlock(): void {
    if (!this._isRange) {
      this._from = this._min;
    }

    if (this._isVertical) {
      (this._$wrapper).addClass('mi-slider__wrapper_vertical');
    }

    if (this._inputFromClass) {
      this._$inputFrom = $(`.${this._inputFromClass}`);
    }

    if (this._inputToClass) {
      this._$inputTo = $(`.${this._inputToClass}`);
    }

    if (!this._isRange && this._$inputFrom) {
      $(this._$inputFrom).attr('disabled', 'disabled');
    } else {
      $(this._$inputFrom).removeAttr('disabled');
    }
  }

  private _checkNewFromValue(value: number): number {
    let val = value;

    val = Number.isNaN(val) ? this._from : val;
    val = val >= this._to ? this._from : val;
    val = val < this._min ? this._from : val;

    return val;
  }

  private _checkNewToValue(value: number): number {
    let val = value;

    val = Number.isNaN(val) ? this._to : val;
    val = val > this._max ? this._max : val;
    val = val <= this._from ? this._to : val;

    return val;
  }

  private _setCurrentMax(value: number): void {
    this._to = value;
    this.fire({ type: 'SET_TO_VALUE', value });

    this._changeInputToValue(value);
  }

  private _setCurrentMin(value: number): void {
    this._from = value;
    this.fire({ type: 'SET_FROM_VALUE', value });

    this._changeInputFromValue(value);
  }

  private _changeInputFromValue(value: number): void {
    if (typeof this._inputFromClass !== 'undefined') {
      this._$inputFrom.val(value);
    }
  }

  private _changeInputToValue(value: number): void {
    if (typeof this._inputToClass !== 'undefined') {
      this._$inputTo.val(value);
    }
  }

  private _createToLabel(): Label {
    return new Label({
      value: this._to,
      type: 'toThumb',
      position: this._toThumbPosition,
      isVertical: this._isVertical,
    });
  }

  private _createFromLabel(): Label {
    return new Label({
      value: this._from,
      type: 'fromThumb',
      position: this._fromThumbPosition,
      isVertical: this._isVertical,
    });
  }

  private _createFromThumb(): Thumb {
    return new Thumb({
      type: 'fromThumb',
      startPosition: this._from,
      label: this._fromThumbLabel,
      step: this._step,
      wrapper: this._$wrapper,
      progressBar: this._progressBar,
      max: this._max,
      min: this._min,
      otherThumbPosition: this._toThumbPosition,
      vertical: this._isVertical,
    });
  }

  private _createToThumb(): Thumb {
    return new Thumb({
      type: 'toThumb',
      startPosition: this._to,
      label: this._toThumbLabel,
      step: this._step,
      wrapper: this._$wrapper,
      progressBar: this._progressBar,
      max: this._max,
      min: this._min,
      otherThumbPosition: this._fromThumbPosition,
      vertical: this._isVertical,
      isRange: this._isRange,
    });
  }

  private _createScale(): Scale {
    return new Scale({
      min: this._min,
      max: this._max,
      toThumbPosition: this._toThumbPosition,
      setToThumb: this._toThumb.handleThumbMove,
      setToThumbActive: this._toThumb.setIsActive,
      fromThumbPosition: this._fromThumbPosition,
      setFromThumb: this._fromThumb?.handleThumbMove,
      isVertical: this._isVertical,
      setFromThumbActive: this._fromThumb?.setIsActive,
      isRange: this._isRange,
    });
  }

  private render(root: JQuery): void {
    if (this._isRange) {
      this._$wrapper.append(this._fromThumb.render());
    }

    this._$wrapper
      .append(this._toThumb.render())
      .append(this._scale.render())
      .append(this._progressBar.render());

    if (this._hasLabels) {
      if (this._isRange) {
        this._$wrapper.append(this._fromThumbLabel.render());
      }

      this._$wrapper.append(this._toThumbLabel.render());
    }

    root.append(this._$wrapper);
  }
}
