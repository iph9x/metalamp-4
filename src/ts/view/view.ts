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
  // private right: {
  //   start: number | null,
  //   active: boolean,
  //   position: number,
  //   thumb: ThumbSubView,
  //   thumbHTML: JQuery,
  //   label: LabelSubView
  // };

  private rightThumbActive: boolean = false;
  private rightThumbPosition: number;
  
  private leftThumbActive: boolean = false;
  private leftThumbPosition: number;

  private shiftRightX: number;
  private shiftLeftX: number;

  private wrapper = $('<div class="mi-slider__wrapper"></div>');
  private track  = $('<div class="mi-slider__track"></div>');

  private leftThumb: Thumb;
  private rightThumb: Thumb;
  private leftThumbHTML: JQuery;
  private rightThumbHTML: JQuery;

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

    this.setCurrentMin(min || 0);
    this.setCurrentMax(max || 100);

    this.setLeftPositionByVal(leftStartPos);
    this.setRightPositionByVal(rightStartPos);

    this.rightLabel = new Label(rightStartPos, 'right', this.rightThumbPosition);
    this.leftLabel = new Label(leftStartPos, 'left', this.leftThumbPosition);


    this.leftThumb = new Thumb('left', this.leftThumbPosition);
    this.rightThumb = new Thumb('right', this.rightThumbPosition);

    $(this.track).css('left',  `${this.leftThumbPosition}%`);
    $(this.track).css('right',  `${this.rightThumbPosition}%`);

    this.leftThumbHTML = this.leftThumb.render();
    this.rightThumbHTML = this.rightThumb.render();

    if (this.isRange || this.min) {
      this.wrapper.append(this.leftThumbHTML)
    }
    this.wrapper
      .append(this.rightThumbHTML)
      .append(this.track);

    if (this.labelsVisibility) {
      this.wrapper
        .append(this.rightLabel.render())
        .append(this.leftLabel.render());
    }

    that.append(this.wrapper);

    this.onRightThumbClick();
    this.onRightThumbMouseUp();
    this.onRightThumbMove();
    this.onLeftThumbClick();
    this.onLeftThumbMouseUp();
    this.onLeftThumbMove();
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

  onRightThumbClick() {
    this.rightThumbHTML.on('mousedown', (e: JQuery.Event) => {
      e.preventDefault();
      this.rightThumbActive = true;
      
      this.rightLabel.show();

      this.shiftRightX = e.pageX - this.rightThumbHTML.get(0).getBoundingClientRect().left - (this.leftThumbHTML.width() / 2);
    });
  }

  onRightThumbMove() {
    $(document).on('mousemove', (e: JQuery.Event) => {
      if (this.rightThumbActive === false) return;

      let step = this.getValueToPercent(this.step);
      let newRightThumbPos: number = 100 - (e.pageX - this.shiftRightX - this.wrapper.get(0).getBoundingClientRect().left) * 100 / this.wrapper.width();
      

      newRightThumbPos = 100 - Math.round(((100 - newRightThumbPos) / step)) * step;

      newRightThumbPos = this.checkBorders(newRightThumbPos, this.leftThumbPosition);
      this.rightThumbHTML.css('right', `${newRightThumbPos}%`);
      this.track.css('right', `${newRightThumbPos}%`);
      
      this.rightLabel.setPosition(newRightThumbPos);

      
      this.rightThumbPosition = newRightThumbPos;
      this.setCurrentMax(Math.round(this.min + (1 - newRightThumbPos / 100) * (this.max - this.min)));
      
      this.rightLabel.setValue(this.currentMax);

    })
  }

  onRightThumbMouseUp() {
    $(document).on('mouseup', () => {
      if (this.rightThumbActive) {
        this.rightThumbActive = false;
        this.rightLabel.hide();
      }
    });
  }

  onLeftThumbClick() {
    this.leftThumbHTML.on('mousedown', (e: JQuery.Event) => {
      e.preventDefault();
      this.leftThumbActive = true;
      
      this.leftLabel.show();

      this.shiftLeftX = e.pageX - this.leftThumbHTML.get(0).getBoundingClientRect().left - (this.leftThumbHTML.width() / 2);
    });
  }

  onLeftThumbMove() {
    $(document).on('mousemove', (e: JQuery.Event) => {
      if (this.leftThumbActive === false) return;

      let step = this.getValueToPercent(this.step);
      let newLeftThumbPos: number = (e.pageX - this.shiftLeftX - this.wrapper.get(0).getBoundingClientRect().left) * 100 / this.wrapper.width();

      newLeftThumbPos = Math.round((newLeftThumbPos / step)) * step;

      newLeftThumbPos = this.checkBorders(newLeftThumbPos, this.rightThumbPosition);
      this.leftThumbHTML.css('left', `${newLeftThumbPos}%`);
      this.track.css('left', `${newLeftThumbPos}%`);

      this.leftLabel.setPosition(newLeftThumbPos);

      this.leftThumbPosition = newLeftThumbPos;
      this.setCurrentMin(Math.round(this.min + (newLeftThumbPos / 100) * (this.max - this.min)));
      this.leftLabel.setValue(this.currentMin);
    })
  }

  onLeftThumbMouseUp() {
    $(document).on('mouseup', () => {
      if (this.leftThumbActive) {
        this.leftThumbActive = false;
        this.leftLabel.hide();

      }
    });
  }

  setLeftPositionByVal(val: number): void {
    if (val < this.min) {
      this.leftThumbPosition = 0;
    } else if (val > this.max) {
      this.leftThumbPosition = 100;
    } else {
      this.leftThumbPosition = (1 - (this.max - val) / (this.max - this.min)) * 100;
    }
    this.setCurrentMin(val);
  }

  setRightPositionByVal(val: number): void {
    if (val < this.min) {
      this.rightThumbPosition = 0;
    } else if (val > this.max) {
      this.rightThumbPosition = 100;
    } else {
      this.rightThumbPosition = ((this.max - val) / (this.max - this.min)) * 100;
    }
    this.setCurrentMax(val);
  }

  getValueToPercent(val: number): number {
    const that = this;
    return val / (that.max - that.min) * 100;
  }

  checkBorders = (position: number, border: number): number => {
    if (position < 0) {
      return 0;
    } else if (position >= 100 - border) {
      return 100 - border - this.getValueToPercent(this.step);
    } else if (position > 100) {
      return 100;
    } else {
      return position;
    }
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
}