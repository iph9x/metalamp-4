import Label from '../subView/label';
import Thumb from '../subView/thumb';
import ProgressBar from '../subView/progressBar';
import Scale from '../subView/scale';
import Observer from '../pattern/observer';

interface IView {
  step: number,
  min: number,
  max: number,
  from: number,
  to: number,
  updateFrom(value: number): void,
  updateTo(value: number): void,
  update(action: { type: string, value: number }): void,
  run(): void,
}

type ViewArgs = {
  slider: JQuery,
  isRange?: boolean,
  labelsVisibility?: boolean,
  isVertical?: boolean,
  inputFromId?: string,
  inputToId?: string,
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

  private _slider: JQuery;

  private _isRange?: boolean;

  private _step?: number;

  private _from?: number;

  private _to?: number;

  private _labelsVisibility?: boolean;

  private _inputFromId?: string;

  private _inputToId?: string;

  constructor({
    slider,
    isRange,
    labelsVisibility,
    isVertical,
    inputFromId,
    inputToId,
  }: ViewArgs) {
    super();
    this._slider = $(slider);
    this._isVertical = isVertical ?? false;
    this._isRange = isRange ?? true;
    this._inputFromId = inputFromId;
    this._inputToId = inputToId;
    this._labelsVisibility = labelsVisibility ?? true;
  }

  private _initInputFrom(): void {
    if (this._inputFromId) {
      this._$inputFrom.off();
      this._$inputFrom.on('blur', (e: Event) => {
        const val = this._checkNewFromValue(Number($(e.target).val()));
        this._fromThumb.setPositionByValue(val);
      });
    }
  }

  private _initInputTo(): void {
    if (this._$inputTo) {
      this._$inputTo.off();
      this._$inputTo.on('blur', (e: Event) => {
        const val = this._checkNewToValue(Number($(e.target).val()));
        this._toThumb.setPositionByValue(val);
      });
    }
  }

  private _runConditionsBlock(): void {
    if (!this._isRange) {
      this._from = this._min;
    }

    if (this._isVertical) {
      (this._$wrapper).addClass('mi-slider__wrapper_vertical');
    }

    if (this._inputFromId) {
      this._$inputFrom = $(`#${this._inputFromId}`);
    }

    if (this._inputToId) {
      this._$inputTo = $(`#${this._inputToId}`);
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
    if (typeof this._inputFromId !== 'undefined') {
      this._$inputFrom.val(value);
    }
  }

  private _changeInputToValue(value: number): void {
    if (typeof this._inputToId !== 'undefined') {
      this._$inputTo.val(value);
    }
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
      setToThumb: this._toThumb.setPositionHandler,
      setToThumbActive: this._toThumb.setIsActive,
      fromThumbPosition: this._fromThumbPosition,
      setFromThumb: this._fromThumb?.setPositionHandler,
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

    if (this._labelsVisibility) {
      if (this._isRange) {
        this._$wrapper.append(this._fromThumbLabel.render());
      }
      
      this._$wrapper.append(this._toThumbLabel.render());
    }

    root.append(this._$wrapper);
  }

  public run(): void {
    const that = this._slider;

    this._runConditionsBlock();

    that.addClass('mi-slider');
    this._progressBar = new ProgressBar(this._isRange, this._isVertical);

    this._changeInputFromValue(this._from);
    this._changeInputToValue(this._to);

    this._fromThumbPosition = (1 - (this._max - this._from) / (this._max - this._min)) * 100;
    this._toThumbPosition = ((this._max - this._to) / (this._max - this._min)) * 100;

    this._toThumbLabel = new Label({
      value: this._to,
      type: 'toThumb',
      position: this._toThumbPosition,
      isVertical: this._isVertical,
    });
    this._fromThumbLabel = new Label({
      value: this._from,
      type: 'fromThumb',
      position: this._fromThumbPosition,
      isVertical: this._isVertical,
    });

    if (this._isRange) {
      this._fromThumb = this._createFromThumb();
      this._fromThumb.subscribe(this);

      this._initInputFrom();
    }

    this._toThumb = this._createToThumb();
    this._toThumb.subscribe(this);

    this._scale = this._createScale();

    this._progressBar.onClick(this._scale.clickHandler.bind(this._scale));

    this._initInputTo();
    this.render(that);
  }

  public set min(value: number) {
    this._min = value;
  }

  public set max(value: number) {
    this._max = value;
  }

  public get to(): number {
    return this._to;
  }

  public get from(): number {
    return this._from;
  }

  public set to(value: number) {
    this._to = value;
  }

  public set from(value: number) {
    this._from = value;
  }

  public set step(value: number) {
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
    switch (action.type) {
      case ('SET_CURRENT_MAX'):
        this._setCurrentMax(action.value);
        break;
      case ('SET_CURRENT_MIN'):
        this._setCurrentMin(action.value);
        break;
      case ('SET_TO_THUMB_POSITION'):
        this._toThumbPosition = action.value;
        if (this._isRange) {
          this._fromThumb.otherThumbPosition = action.value;
        }

        this._scale.toThumbPosition = action.value;
        break;
      case ('SET_FROM_THUMB_POSITION'):
        this._fromThumbPosition = action.value;
        this._toThumb.otherThumbPosition = action.value;
        this._scale.fromThumbPosition = action.value;
        break;
      default:
        break;
    }
  }
}
