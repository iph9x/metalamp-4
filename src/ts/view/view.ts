import Label from '../subVeiw/label';
import Thumb from '../subVeiw/thumb';
import ProgressBar from '../subVeiw/progressBar';
import Scale from '../subVeiw/scale';
import Observer from '../pattern/observer';

export interface IView {
  max: number,
  min?: number,
  currentMin: number,
  currentMax: number,
  isRange?: boolean,
  slider: object,
  step?: number,
  labelsVisibility?: boolean,
  inputsId?: object
}

export default class View extends Observer implements IView {
  public currentMin: number;
  public currentMax: number;

  private minThumbPosition: number;
  private maxThumbPosition: number;

  private wrapper = $('<div class="mi-slider__wrapper"></div>');
  
  private scale: Scale;
  private progressBar: ProgressBar;

  private minThumb: Thumb;
  private maxThumb: Thumb;

  private minThumbLabel: Label;
  private maxThumbLabel: Label;

  public inputFrom: JQuery;
  public inputTo: JQuery;

  public observers: Array<object>;

  constructor(
    public max: number,
    public min: number,
    public slider: object,
    public isRange?: boolean,
    public step?: number,
    public defaultFromValue?: number,
    public defaultToValue?: number,
    public labelsVisibility?: boolean,
    public vertical?: boolean,
    public inputsId?: {
      inputFromId: string,
      inputToId: string,
    }
  ) {
    super();
    const that = $(this.slider);
    if (that.find('.mi-slider__wrapper')[0]) {
      that.empty();
    }
    this.vertical = typeof vertical !== 'undefined' ? vertical : false;
    this.isRange = typeof isRange !== 'undefined' ? isRange : true; 

    this.labelsVisibility = typeof labelsVisibility === 'undefined' ? true : labelsVisibility;

    if (this.vertical) {
      (this.wrapper).addClass('mi-slider__wrapper_vertical');
    }

    that.addClass('mi-slider');

    this.min = (typeof this.min !== 'undefined') ? min : 0;

    this.step = step ? step : 1;

    if (this.step > this.max - this.min) {
      this.step = this.max - this.min;
    }
    
    this.defaultToValue = (typeof defaultToValue !== 'undefined') && (defaultToValue <= max) ? defaultToValue : max;
    this.defaultFromValue = (typeof defaultFromValue !== 'undefined') && (defaultFromValue >= min) && (defaultFromValue < defaultToValue) && this.isRange ? defaultFromValue : min;
    
    this.progressBar = new ProgressBar(this.defaultFromValue, this.defaultToValue, this.vertical);

    if (this.inputsId?.inputFromId) {
      this.inputFrom = $(`#${this.inputsId.inputFromId}`);
    }
    if (this.inputsId?.inputToId) {
      this.inputTo = $(`#${this.inputsId.inputToId}`);
    }

    this.setCurrentMin(this.defaultFromValue);
    this.setCurrentMax(this.defaultToValue);

    this.minThumbPosition = (1 - (this.max - this.defaultFromValue) / (this.max - this.min)) * 100;
    this.maxThumbPosition = ((this.max - this.defaultToValue) / (this.max - this.min)) * 100;

    this.maxThumbLabel = new Label(this.defaultToValue, 'maxThumb', this.maxThumbPosition, this.vertical);
    this.minThumbLabel = new Label(this.defaultFromValue, 'minThumb', this.minThumbPosition, this.vertical);


    this.minThumb = new Thumb({
      type: 'minThumb',
      startPosition: this.defaultFromValue,
      label: this.minThumbLabel,
      step: this.step,
      wrapper: this.wrapper,
      progressBar: this.progressBar,
      max: this.max,
      min: this.min,
      otherThumbPosition: this.maxThumbPosition,
      vertical: this.vertical
    });

    this.maxThumb = new Thumb({
      type: 'maxThumb',
      startPosition: this.defaultToValue,
      label: this.maxThumbLabel,
      step: this.step,
      wrapper: this.wrapper,
      progressBar: this.progressBar,
      max: this.max,
      min: this.min,
      otherThumbPosition: this.minThumbPosition,
      vertical: this.vertical
    });

    this.scale = new Scale(
      this.min,
      this.max,
      this.maxThumbPosition,
      this.maxThumb.setPositionHandler,
      this.maxThumb.setIsActive,
      this.minThumbPosition,
      this.minThumb.setPositionHandler,
      this.vertical,
      this.minThumb.setIsActive,
      this.isRange
    );
    this.progressBar.onClick(this.scale.clickHandler.bind(this.scale));

    this.maxThumb.subscribe(this);
    this.minThumb.subscribe(this);

    if (this.isRange) {
      this.wrapper.append(this.minThumb.render())
    }
    this.wrapper
      .append(this.maxThumb.render())
      .append(this.scale.render())
      .append(this.progressBar.render());

    if (this.labelsVisibility) {
      this.wrapper
        .append(this.maxThumbLabel.render())
        .append(this.minThumbLabel.render());
    }
    

    that.append(this.wrapper);
  }

  public setCurrentMax(max: number): void {
    this.currentMax = max;
    this.init({type: 'SET_MAX', value: max});
    $(this.slider).attr('data-to-value', max);

    if (typeof this.inputsId?.inputToId !== 'undefined') {
      this.inputTo.val(max);
    }
  }

  public setCurrentMin(min: number): void {
    this.currentMin = min;
    this.init({type: 'SET_MIN', value: min});
    $(this.slider).attr('data-from-value', min);

    if (typeof this.inputsId?.inputFromId !== 'undefined') {
      this.inputFrom.val(min);
    }
  }

  public get getCurrentMax(): number {
    return this.currentMax;
  }

  public get getCurrentMin(): number {
    return this.currentMin;
  }

  update(action: {type: string, value: any }) {
    switch(action.type) {
      case ('SET_CURRENT_MAX'):
        this.setCurrentMax(action.value);
        break;
      case ('SET_CURRENT_MIN'):
        this.setCurrentMin(action.value);
        break;
      case ('SET_MAX_THUMB_POSITION'):
        this.maxThumbPosition = action.value;
        this.minThumb.otherThumbPosition = action.value;
        this.scale.maxThumbPosition = action.value;
        break;
      case ('SET_MIN_THUMB_POSITION'):
        this.minThumbPosition = action.value;
        this.maxThumb.otherThumbPosition = action.value;
        this.scale.minThumbPosition = action.value;
        break;
      default:
        break;
    }
  }
}