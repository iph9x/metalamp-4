import Label from '../subView/label';
import Thumb from '../subView/thumb';
import ProgressBar from '../subView/progressBar';
import Scale from '../subView/scale';
import Observer from '../pattern/observer';

export interface IView {
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

type Props = {
  isRange?: boolean,
  slider: JQuery,
  labelsVisibility?: boolean,
  isVertical?: boolean,
  inputFromId?: string,
  inputToId?: string,
};

export default class View extends Observer implements IView {
  private _minThumbPosition: number;

  private _maxThumbPosition: number;

  private _wrapper = $('<div class="mi-slider__wrapper"></div>');

  private _scale: Scale;

  private _progressBar: ProgressBar;

  private _minThumb: Thumb;

  private _maxThumb: Thumb;

  private _minThumbLabel: Label;

  private _maxThumbLabel: Label;

  private _inputFrom: JQuery;

  private _inputTo: JQuery;

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
  }: Props) {
    super();
    this._slider = $(slider);
    this._isVertical = isVertical ?? false;
    this._isRange = isRange ?? true;
    this._inputFromId = inputFromId;
    this._inputToId = inputToId;
    this._labelsVisibility = labelsVisibility ?? true;
  }

  public run(): void {
    const that = this._slider;

    this._conditionsBlock();

    that.addClass('mi-slider');
    this._progressBar = new ProgressBar(this._isRange, this._isVertical);
    
    this._changeInputFromValue(this._from);
    this._changeInputToValue(this._to);

    this._minThumbPosition = (1 - (this._max - this._from) / (this._max - this._min)) * 100;
    this._maxThumbPosition = ((this._max - this._to) / (this._max - this._min)) * 100;

    this._maxThumbLabel = new Label(this._to, 'maxThumb', this._maxThumbPosition, this._isVertical);
    this._minThumbLabel = new Label(this._from, 'minThumb', this._minThumbPosition, this._isVertical);

    if (this._isRange) {
      this._minThumb = this._createMinThumb();
      this._minThumb.subscribe(this);

      this._initInputFrom();
    }

    this._maxThumb = this._createMaxThumb();
    this._maxThumb.subscribe(this);

    this._scale = this._createScale();

    this._progressBar.onClick(this._scale.clickHandler.bind(this._scale));

    this._inputInputTo();
    this.render(that);
  }

  private _initInputFrom(): void {
    if (this._inputFromId) {
      this._inputFrom.off();
      this._inputFrom.on('blur', (e: Event) => {
        const val = this._checkNewFromValue(Number($(e.target).val()));
        this._minThumb.setPositionByVal(val);
      });
    }
  }

  private _inputInputTo(): void {
    if (this._inputTo) {
      this._inputTo.off();
      this._inputTo.on('blur', (e: Event) => {
        const val = this._checkNewToValue(Number($(e.target).val()));
        this._maxThumb.setPositionByVal(val);
      });
    }
  }

  private _conditionsBlock(): void {
    if (!this._isRange) {
      this._from = this._min;
    }

    if (this._isVertical) {
      (this._wrapper).addClass('mi-slider__wrapper_vertical');
    }

    if (this._inputFromId) {
      this._inputFrom = $(`#${this._inputFromId}`);
    }

    if (this._inputToId) {
      this._inputTo = $(`#${this._inputToId}`);
    }

    if (!this._isRange && this._inputFrom) {
      $(this._inputFrom).attr('disabled', 'disabled');
    } else {
      $(this._inputFrom).removeAttr('disabled');
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
    this.init({ type: 'SET_TO_VALUE', value });

    this._changeInputToValue(value);
  }

  private _setCurrentMin(value: number): void {
    this._from = value;
    this.init({ type: 'SET_FROM_VALUE', value });

    this._changeInputFromValue(value);
  }

  private _changeInputFromValue(value: number): void {
    if (typeof this._inputFromId !== 'undefined') {
      this._inputFrom.val(value);
    }
  }

  private _changeInputToValue(value: number): void {
    if (typeof this._inputToId !== 'undefined') {
      this._inputTo.val(value);
    }
  }

  private _createMinThumb(): Thumb {
    return new Thumb({
      type: 'minThumb',
      startPosition: this._from,
      label: this._minThumbLabel,
      step: this._step,
      wrapper: this._wrapper,
      progressBar: this._progressBar,
      max: this._max,
      min: this._min,
      otherThumbPosition: this._maxThumbPosition,
      vertical: this._isVertical,
    });
  }

  private _createMaxThumb(): Thumb {
    return new Thumb({
      type: 'maxThumb',
      startPosition: this._to,
      label: this._maxThumbLabel,
      step: this._step,
      wrapper: this._wrapper,
      progressBar: this._progressBar,
      max: this._max,
      min: this._min,
      otherThumbPosition: this._minThumbPosition,
      vertical: this._isVertical,
      isRange: this._isRange,
    });
  }

  private _createScale(): Scale {
    return new Scale(
      this._min,
      this._max,
      this._maxThumbPosition,
      this._maxThumb.setPositionHandler,
      this._maxThumb.setIsActive,
      this._minThumbPosition,
      this._minThumb?.setPositionHandler,
      this._isVertical,
      this._minThumb?.setIsActive,
      this._isRange,
    );
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
    this._minThumb.setPositionByVal(newVal);
  }

  public updateTo(value: number) {
    const newVal = this._checkNewToValue(value);
    this._maxThumb.setPositionByVal(newVal);
  }

  private render(root: JQuery): void {
    if (this._isRange) {
      this._wrapper.append(this._minThumb.render());
    }

    this._wrapper
      .append(this._maxThumb.render())
      .append(this._scale.render())
      .append(this._progressBar.render());

    if (this._labelsVisibility) {
      if (this._isRange) {
        this._wrapper.append(this._minThumbLabel.render());
      }
      this._wrapper.append(this._maxThumbLabel.render());
    }

    root.append(this._wrapper);
  }

  public update(action: { type: string, value: number }): void {
    switch (action.type) {
      case ('SET_CURRENT_MAX'):
        this._setCurrentMax(action.value);
        break;
      case ('SET_CURRENT_MIN'):
        this._setCurrentMin(action.value);
        break;
      case ('SET_MAX_THUMB_POSITION'):
        this._maxThumbPosition = action.value;
        if (this._isRange) {
          this._minThumb.otherThumbPosition = action.value;
        }
        this._scale.maxThumbPosition = action.value;
        break;
      case ('SET_MIN_THUMB_POSITION'):
        this._minThumbPosition = action.value;
        this._maxThumb.otherThumbPosition = action.value;
        this._scale.minThumbPosition = action.value;
        break;
      default:
        break;
    }
  }
}
