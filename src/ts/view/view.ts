import Label from '../subView/label';
import Thumb from '../subView/thumb';
import ProgressBar from '../subView/progressBar';
import Scale from '../subView/scale';
import Observer from '../pattern/observer';

export interface IView {
  getToValue: number,
  getFromValue: number,
  update(action: { type: string, value: number }): void;
  destroy(root: JQuery): void;
}

type Props = {
  max: number,
  min: number,
  isRange?: boolean,
  step?: number,
  slider: JQuery,
  from?: number,
  to?: number,
  labelsVisibility?: boolean,
  isVertical?: boolean,
  inputFromId?: string,
  inputToId?: string,
};

export default class View extends Observer implements IView {
  private _fromValue: number;

  private _toValue: number;

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

  private _slider: object;

  private _isRange?: boolean;

  private _step?: number;

  private _from?: number;

  private _to?: number;

  private _labelsVisibility?: boolean;

  private _inputFromId: string;

  private _inputToId: string;

  constructor({
    max,
    min,
    slider,
    isRange,
    step,
    from,
    to,
    labelsVisibility,
    isVertical,
    inputFromId,
    inputToId,
  }: Props) {
    super();
    const that = $(slider);
    this._slider = slider;

    this._max = max;
    this._min = min;
    this._step = step || 1;
    if (this._step > this._max - this._min) {
      this._step = this._max - this._min;
    }
    this._isVertical = typeof isVertical !== 'undefined' ? isVertical : false;
    this._isRange = typeof isRange !== 'undefined' ? isRange : true;
    this._labelsVisibility = typeof labelsVisibility !== 'undefined' ? labelsVisibility : true;
    this._inputFromId = inputFromId;
    this._inputToId = inputToId;
    this._to = (typeof to !== 'undefined') && (to <= this._max) ? to : this._max;
    this._from = (typeof from !== 'undefined') && (from >= this._min) && (from < this._to) && this._isRange ? from : this._min;

    if (this._isVertical) {
      (this._wrapper).addClass('mi-slider__wrapper_vertical');
    }

    if (this._inputFromId) {
      this._inputFrom = $(`#${this._inputFromId}`);
    }

    if (this._inputToId) {
      this._inputTo = $(`#${this._inputToId}`);
    }

    that.addClass('mi-slider');

    this._progressBar = new ProgressBar(this._isRange, this._isVertical);

    this._setCurrentMin(this._from);
    this._setCurrentMax(this._to);

    this._minThumbPosition = (1 - (this._max - this._from) / (this._max - this._min)) * 100;
    this._maxThumbPosition = ((this._max - this._to) / (this._max - this._min)) * 100;

    this._maxThumbLabel = new Label(this._to, 'maxThumb', this._maxThumbPosition, this._isVertical);
    this._minThumbLabel = new Label(this._from, 'minThumb', this._minThumbPosition, this._isVertical);

    if (this._isRange) {
      this._minThumb = this._createMinThumb();
      this._minThumb.subscribe(this);

      this._inputFrom.off();
      this._inputFrom.on('blur', (e: Event) => this._onBlurFromHandler(e));
    }

    this._maxThumb = this._createMaxThumb();
    this._maxThumb.subscribe(this);

    this._scale = this._createScale();

    this._progressBar.onClick(this._scale.clickHandler.bind(this._scale));

    this._inputTo.off();
    this._inputTo.on('blur', (e: Event) => this._onBlurToHandler(e));

    this.render(that);
  }

  public destroy(root: JQuery) {
    this._wrapper = $('<div class="mi-slider__wrapper"></div>');
    root.empty();
  }

  private _onBlurFromHandler(e: Event) {
    let val = Number($(e.target).val());

    val = Number.isNaN(val) ? this._fromValue : val;
    val = val >= this._toValue ? this._fromValue : val;
    val = val < this._min ? this._fromValue : val;
    this._minThumb.setPositionByVal(val);
  }

  private _onBlurToHandler(e: Event) {
    let val = Number($(e.target).val());

    val = Number.isNaN(val) ? this._toValue : val;
    val = val > this._max ? this._max : val;
    val = val <= this._fromValue ? this._toValue : val;

    this._maxThumb.setPositionByVal(val);
  }

  private _setCurrentMax(value: number): void {
    this._toValue = value;
    this.init({ type: 'SET_TO_VALUE', value });
    $(this._slider).attr('data-to-value', value);

    if (typeof this._inputToId !== 'undefined') {
      this._inputTo.val(value);
    }
  }

  private _setCurrentMin(value: number): void {
    this._fromValue = value;
    this.init({ type: 'SET_FROM_VALUE', value });
    $(this._slider).attr('data-from-value', value);

    if (typeof this._inputFromId !== 'undefined') {
      this._inputFrom.val(value);
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

  public get getToValue(): number {
    return this._toValue;
  }

  public get getFromValue(): number {
    return this._fromValue;
  }

  public render(root: JQuery): void {
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

  update(action: { type: string, value: number }): void {
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
