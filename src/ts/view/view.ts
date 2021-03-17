import Label from '../subVeiw/label';
import Thumb from '../subVeiw/thumb';

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

export default class View implements IView {
  public currentMin: number;
  public currentMax: number;

  private rightThumbPosition: number;
  private leftThumbPosition: number;

  private stepInPercent: number;

  private wrapper = $('<div class="mi-slider__wrapper"></div>');
  private track  = $('<div class="mi-slider__track"></div>');

  private leftThumb: Thumb;
  private rightThumb: Thumb;

  private rightLabel: Label;
  private leftLabel: Label;

  private observers: Array<object>;

  constructor(
    public max: number,
    public min: number,
    public slider: object,
    public isRange?: boolean,
    public step?: number,
    public leftStartPos?: number,
    public rightStartPos?: number,
    public labelsVisibility?: boolean
  ) {

    this.observers = [];

    this.labelsVisibility = typeof labelsVisibility === 'undefined' ? true : labelsVisibility;

    const that = $(this.slider);

    that.addClass('mi-slider');

    this.step = step ? step : (this.max - this.min) / $(this.slider).width();
    this.stepInPercent = this.getValueToPercent(this.step);

    this.setCurrentMin(leftStartPos || min || 0);
    this.setCurrentMax(rightStartPos || max);

    this.leftThumbPosition = (1 - (this.max - leftStartPos) / (this.max - this.min)) * 100;
    this.rightThumbPosition = ((this.max - rightStartPos) / (this.max - this.min)) * 100;


    this.rightLabel = new Label(rightStartPos, 'right', this.rightThumbPosition);
    this.leftLabel = new Label(leftStartPos, 'left', this.leftThumbPosition);


    this.leftThumb = new Thumb(
      'left',
      leftStartPos,
      this.leftLabel,
      this.stepInPercent,
      this.wrapper,
      this.track,
      this.max,
      this.min,
      this.rightThumbPosition,
    );
    this.rightThumb = new Thumb(
      'right',
      this.rightStartPos,
      this.rightLabel,
      this.stepInPercent,
      this.wrapper,
      this.track,
      this.max,
      this.min,
      this.leftThumbPosition,
    );

    this.rightThumb.subscribe(this);
    this.leftThumb.subscribe(this);

    const leftThumbHTML = this.leftThumb.render();
    const rightThumbHTML = this.rightThumb.render();

    if (this.isRange || this.min) {
      this.wrapper.append(leftThumbHTML)
    }
    this.wrapper
      .append(rightThumbHTML)
      .append(this.track);

    if (this.labelsVisibility) {
      this.wrapper
        .append(this.rightLabel.render())
        .append(this.leftLabel.render());
    }

    that.append(this.wrapper);
  }

  subscribe(observer: object) {
    this.observers.push(observer);
  }

  unsubscribe(observer: object) {
    this.observers.filter((obs) => obs !== observer);
  }

  init(action: {type: string, value?: number}) {
    this.observers.forEach((observer: {update: Function}) => {
      observer.update(action);
    });
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
      case ('SET_RIGHT_POSITION'):
        this.rightThumbPosition = action.value;
        this.leftThumb.otherThumbPosition = action.value;
        break;
      case ('SET_LEFT_POSITION'):
        this.leftThumbPosition = action.value;
        this.rightThumb.otherThumbPosition = action.value;
        break;
      default:
        break;
    }
  }
}