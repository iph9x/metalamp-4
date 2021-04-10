import Label from '../subVeiw/label';
import Thumb from '../subVeiw/thumb';
import ProgressBar from '../subVeiw/progressBar';
import Scale from '../subVeiw/scale';
import Observer from '../pattern/observer';

export interface IView {
  getToValue: number,
  getFromValue: number
}

type Props = {
  max: number,
  min: number,
  isRange?: boolean,
  step?: number,
  slider: object,
  defaultFromValue?: number,
  defaultToValue?: number,
  labelsVisibility?: boolean,
  isVertical?: boolean,
  inputsId?: {
    inputFromId: string,
    inputToId: string,
  }
}

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
  private _defaultFromValue?: number;
  private _defaultToValue?: number;
  private _labelsVisibility?: boolean;
  private _inputsId?: {
    inputFromId: string,
    inputToId: string,
  }

  constructor({
    max,
    min,
    slider,
    isRange,
    step,
    defaultFromValue,
    defaultToValue,
    labelsVisibility,
    isVertical,
    inputsId
  }: Props) {
    super();

    this._slider = slider;
    this._max = max;
    this._min = min;
    this._step = step ? step : 1;
    if (this._step > this._max - this._min) {
      this._step = this._max - this._min;
    }
    this._isVertical = typeof isVertical !== 'undefined' ? isVertical : false;
    this._isRange = typeof isRange !== 'undefined' ? isRange : true; 
    this._labelsVisibility = typeof labelsVisibility !== 'undefined' ? labelsVisibility : true;
    this._inputsId = {...inputsId};
    this._defaultToValue = (typeof defaultToValue !== 'undefined') && (defaultToValue <= this._max) ? defaultToValue : this._max;
    this._defaultFromValue = (typeof defaultFromValue !== 'undefined') && (defaultFromValue >= this._min) && (defaultFromValue < this._defaultToValue) && this._isRange ? defaultFromValue : this._min;
    
    const that = $(this._slider);

    if (that.find('.mi-slider__wrapper')[0]) {
      that.empty();
    }

    if (this._isVertical) {
      (this._wrapper).addClass('mi-slider__wrapper_vertical');
    }

    if (this._inputsId?.inputFromId) {
      this._inputFrom = $(`#${this._inputsId.inputFromId}`);
    }

    if (this._inputsId?.inputToId) {
      this._inputTo = $(`#${this._inputsId.inputToId}`);
    }

    that.addClass('mi-slider');

    this._progressBar = new ProgressBar(this._isVertical);
    
    this._setCurrentMin(this._defaultFromValue);
    this._setCurrentMax(this._defaultToValue);
    
    this._minThumbPosition = (1 - (this._max - this._defaultFromValue) / (this._max - this._min)) * 100;
    this._maxThumbPosition = ((this._max - this._defaultToValue) / (this._max - this._min)) * 100;
    
    this._maxThumbLabel = new Label(this._defaultToValue, 'maxThumb', this._maxThumbPosition, this._isVertical);
    this._minThumbLabel = new Label(this._defaultFromValue, 'minThumb', this._minThumbPosition, this._isVertical);
    
    this._minThumb = this._createMinThumb();
    this._maxThumb = this._createMaxThumb();
    

    this._scale = this._createScale();

    this._progressBar.onClick(this._scale.clickHandler.bind(this._scale));

    this._maxThumb.subscribe(this);
    this._minThumb.subscribe(this);

    this.render();
  }

  private _setCurrentMax(max: number): void {
    this._toValue = max;
    this.init({type: 'SET_TO_VALUE', value: max});
    $(this._slider).attr('data-to-value', max);

    if (typeof this._inputsId?.inputToId !== 'undefined') {
      this._inputTo.val(max);
    }
  }

  private _setCurrentMin(min: number): void {
    this._fromValue = min;
    this.init({type: 'SET_FROM_VALUE', value: min});
    $(this._slider).attr('data-from-value', min);

    if (typeof this._inputsId?.inputFromId !== 'undefined') {
      this._inputFrom.val(min);
    }
  }

  private _createMinThumb(): Thumb {
    return new Thumb({
      type: 'minThumb',
      startPosition: this._defaultFromValue,
      label: this._minThumbLabel,
      step: this._step,
      wrapper: this._wrapper,
      progressBar: this._progressBar,
      max: this._max,
      min: this._min,
      otherThumbPosition: this._maxThumbPosition,
      vertical: this._isVertical
    });
  }

  private _createMaxThumb(): Thumb {
    return new Thumb({
      type: 'maxThumb',
      startPosition: this._defaultToValue,
      label: this._maxThumbLabel,
      step: this._step,
      wrapper: this._wrapper,
      progressBar: this._progressBar,
      max: this._max,
      min: this._min,
      otherThumbPosition: this._minThumbPosition,
      vertical: this._isVertical
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
      this._minThumb.setPositionHandler,
      this._isVertical,
      this._minThumb.setIsActive,
      this._isRange
    );
  }

  public get getToValue(): number {
    return this._toValue;
  }

  public get getFromValue(): number {
    return this._fromValue;
  }

  public render(): void {
    if (this._isRange) {
      this._wrapper.append(this._minThumb.render())
    }

    this._wrapper
      .append(this._maxThumb.render())
      .append(this._scale.render())
      .append(this._progressBar.render());

    if (this._labelsVisibility) {
      this._wrapper
        .append(this._maxThumbLabel.render())
        .append(this._minThumbLabel.render());
    }
    
    $(this._slider).append(this._wrapper);
  }

  update(action: {type: string, value: any }) {
    switch(action.type) {
      case ('SET_CURRENT_MAX'):
        this._setCurrentMax(action.value);
        break;
      case ('SET_CURRENT_MIN'):
        this._setCurrentMin(action.value);
        break;
      case ('SET_MAX_THUMB_POSITION'):
        this._maxThumbPosition = action.value;
        this._minThumb.otherThumbPosition = action.value;
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