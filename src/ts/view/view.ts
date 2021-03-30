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
  labelsVisibility?: boolean
}

export default class View extends Observer implements IView {
  public currentMin: number;
  public currentMax: number;

  private minThumbPosition: number;
  private maxThumbPosition: number;

  private stepInPercent: number;
  public vertical: boolean;
  public isRange: boolean;
  private wrapper = $('<div class="mi-slider__wrapper"></div>');
  
  private scale: Scale;
  private progressBar: ProgressBar;

  private minThumb: Thumb;
  private maxThumb: Thumb;

  private minThumbLabel: Label;
  private maxThumbLabel: Label;

  public observers: Array<object>;

  constructor(
    public max: number,
    public min: number,
    public slider: object,
    isRange?: boolean,
    public step?: number,
    public minThumbStartPos?: number,
    public maxThumbStartPos?: number,
    public labelsVisibility?: boolean,
    vertical?: boolean
  ) {
    super();
    this.vertical = vertical ? vertical : false;
    this.isRange = typeof isRange !== 'undefined' ? isRange : true; 

    this.labelsVisibility = typeof labelsVisibility === 'undefined' ? true : labelsVisibility;

    const that = $(this.slider);
    if (this.vertical) {
      (this.wrapper).addClass('mi-slider__wrapper_vertical');
    }
    that.addClass('mi-slider');


    this.min = (typeof this.min !== 'undefined') ? min : 0;
    this.step = step ? step : (this.max - this.min) / $(this.slider).width();
    this.stepInPercent = this.getValueToPercent(this.step);
    
    this.minThumbStartPos = (typeof minThumbStartPos !== 'undefined') && (minThumbStartPos >= min) && (minThumbStartPos < maxThumbStartPos) && this.isRange ? minThumbStartPos : min;
    this.maxThumbStartPos = (typeof maxThumbStartPos !== 'undefined') && (maxThumbStartPos <= max) ? maxThumbStartPos : max;
    
    this.progressBar = new ProgressBar(this.minThumbStartPos, this.maxThumbStartPos, this.vertical);
    this.setCurrentMin(this.minThumbStartPos);
    this.setCurrentMax(this.maxThumbStartPos);

    this.minThumbPosition = (1 - (this.max - this.minThumbStartPos) / (this.max - this.min)) * 100;
    this.maxThumbPosition = ((this.max - this.maxThumbStartPos) / (this.max - this.min)) * 100;

    this.maxThumbLabel = new Label(this.maxThumbStartPos, 'maxThumb', this.maxThumbPosition, this.vertical);
    this.minThumbLabel = new Label(this.minThumbStartPos, 'minThumb', this.minThumbPosition, this.vertical);


    this.minThumb = new Thumb({
      type: 'minThumb',
      startPosition: this.minThumbStartPos,
      label: this.minThumbLabel,
      step: this.stepInPercent,
      wrapper: this.wrapper,
      progressBar: this.progressBar,
      max: this.max,
      min: this.min,
      otherThumbPosition: this.maxThumbPosition,
      vertical: this.vertical
    });

    this.maxThumb = new Thumb({
      type: 'maxThumb',
      startPosition: this.maxThumbStartPos,
      label: this.maxThumbLabel,
      step: this.stepInPercent,
      wrapper: this.wrapper,
      progressBar: this.progressBar,
      max: this.max,
      min: this.min,
      otherThumbPosition: this.minThumbPosition,
      vertical: this.vertical
    });

    this.scale = new Scale(
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

  getValueToPercent(val: number): number {
    return val / (this.max - this.min) * 100;
  }

  public setCurrentMax(max: number): void {
    this.currentMax = max;
    this.init({type: 'SET_MAX', value: max});
  }

  public setCurrentMin(min: number): void {
    this.currentMin = min;
    this.init({type: 'SET_MIN', value: min});
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
        this.currentMax = action.value;
        this.init({type: 'SET_MAX', value: action.value});
        break;
      case ('SET_CURRENT_MIN'):
        this.currentMin = action.value;
        this.init({type: 'SET_MIN', value: action.value});
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