import { ContextReplacementPlugin } from 'webpack';
import Label from '../subVeiw/label';
import ProgressBar from '../subVeiw/progressBar';

export interface IThumb {
  readonly type: string,
  position: number,
}

type Props = {
  type: 'minThumb' | 'maxThumb';
  startPosition?: number;
  label?: Label;
  step?: number;
  wrapper: JQuery;
  progressBar: ProgressBar;
  max: number;
  min: number;
  otherThumbPosition?: number;
  vertical?: boolean
}

export default class Thumb implements IThumb {
  private thumb: JQuery = $('<span class="mi-slider__circle"></span>');
  private shift: number = 0;
  private isActive: boolean = false;
  private observers: Array<object> = [];
  private current: number;
  private isMaxThumb: boolean;
  public position: number;


  public type: 'minThumb' | 'maxThumb';
  public startPosition: number;
  public label: Label;
  private step: number;
  private wrapper: JQuery;
  private progressBar: ProgressBar;
  private max: number;
  private min: number;
  public otherThumbPosition?: number;
  public vertical?: boolean;

  private cssType: string;

  constructor({
    type,
    startPosition,
    label,
    step,
    wrapper,
    progressBar,
    max,
    min,
    otherThumbPosition,
    vertical
  }: Props) {
    this.type = type;
    this.startPosition = startPosition;
    this.label = label;
    this.step = step;
    this.wrapper = wrapper;
    this.progressBar = progressBar;
    this.max = max;
    this.min = min;
    this.otherThumbPosition = otherThumbPosition;
    this.vertical = vertical;
    if (this.type === 'minThumb') {
      if (this.vertical) {
        this.cssType = 'top';
      } else {
        this.cssType = 'left';
      }
    } else {
      if (this.vertical) {
        this.cssType = 'bottom';
      } else {
        this.cssType = 'right';
      }
    }

    this.thumb.addClass(`mi-slider__circle_${this.cssType}`);
    this.isMaxThumb = this.type === 'maxThumb'; 

    this.current = this.isMaxThumb ? max : min;
    if (this.isMaxThumb) {
      this.startPosition = startPosition ? startPosition : max;
    } else {
      this.startPosition = startPosition ? startPosition : min;
    }

    this.setPositionByVal(startPosition)
    this.render();

    this.onThumbClick();
    // this.onThumbMove();
    this.onThumbMouseUp();

    this.setPositionHandler = this.setPositionHandler.bind(this);
    this.calcNewPos = this.calcNewPos.bind(this);
    this.setIsActive = this.setIsActive.bind(this);
  }

  subscribe(observer: object) {
    this.observers.push(observer);
  }

  unsubscribe(observer: object) {
    this.observers.filter((obs) => obs !== observer);
  }

  init(action: {type: string, value?: number | boolean}) {
    this.observers.forEach((observer: {update: Function}) => {
      observer.update(action);
    });
  }

  render() {
    return this.thumb;
  }

  private onThumbClick() {
    this.thumb.on('mousedown', (e: JQuery.Event) => this.clickHandler(e))
  }

  public clickHandler(e: JQuery.Event): void {
    e.preventDefault();

    this.setIsActive(true);
    this.label.show();
    this.shift = this.vertical ? this.calcShift(e.pageY, 'top', 'height') : this.calcShift(e.pageX, 'left', 'width');
    $('html').css('cursor', 'pointer');

    this.onThumbMove();
  }

  private onThumbMove() {
    $(document).on('mousemove', (e: JQuery.Event) => this.setPositionHandler(e))
  }

  public setPositionHandler(e: JQuery.Event): void {
    if (!this.isActive) return;
    
    let calcedX: number = this.calcNewPos(e.pageX, 'left', 'width');
    let calcedY: number = this.calcNewPos(e.pageY, 'top', 'height');
    let step = this.step;
    let newPosition: number;
    
    if (this.isMaxThumb) {
      newPosition = this.vertical ? 100 - calcedY : 100 - calcedX;
      newPosition = 100 - Math.round(((100 - newPosition) / step)) * step;
    } else {
      newPosition = this.vertical ? calcedY : calcedX;
      newPosition = Math.round((newPosition / step)) * step;
    }

    newPosition = this.checkBorders(newPosition, this.otherThumbPosition);

    if (this.isMaxThumb) {
      this.progressBar.setMaxPosition(newPosition);
      let value = Math.round(this.min + (1 - newPosition / 100) * (this.max - this.min));
      this.current = value;
      this.init({type: 'SET_CURRENT_MAX', value});
    } else {
      this.progressBar.setMinPosition(newPosition);
      let value = Math.round(this.min + (newPosition / 100) * (this.max - this.min));
      this.current = value;
      this.init({type: 'SET_CURRENT_MIN', value});
    }

    this.thumb.css(this.cssType, `${newPosition}%`);
    this.label.setPosition(newPosition);
    this.label.setValue(this.current);
    this.position = newPosition;

    this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', newPosition);
  }

  private onThumbMouseUp() {
    $(document).on('mouseup', () => {
      if (this.isActive) {
        this.setIsActive(false);
        this.label.hide();

        $('html').css('cursor', 'default');
        $(document).off('mousemove');
      }
    });
  }

  public calcShift (mousePos: number, type: 'top' | 'left', dimension: 'width' | 'height'): number {
    return mousePos - this.thumb.get(0).getBoundingClientRect()[type] - (this.thumb[dimension]() / 2);
  }

  public calcNewPos (mousePos: number, type: 'left' | 'top', dimension: 'height' | 'width'): number {
    return (mousePos - this.shift - this.wrapper.get(0).getBoundingClientRect()[type]) * 100 / this.wrapper[dimension]();
  }

  private checkBorders = (position: number, border: number): number => {
    if (position < 0) {
      return 0;
    } else if (Number((position).toFixed(8)) >= Number((100 - border).toFixed(8))) {
      return 100 - border - this.step;
    } else if (position > 100) {
      return 100;
    } else {
      return position;
    }
  } 

  private setPositionByVal(val: number): void {
    if (val < this.min) {
      this.position = 0;
    } else if (val > this.max) {
      this.position = 100;
    } else if (this.isMaxThumb) {
      this.position = ((this.max - val) / (this.max - this.min)) * 100;
    } else {
      this.position = (1 - (this.max - val) / (this.max - this.min)) * 100;
    }
    this.setCurrent(val);
    this.thumb.css(this.cssType, `${this.position}%`);
    this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', this.position);
    if (this.isMaxThumb) {
      this.progressBar.setMaxPosition(this.position);
    } else {
      this.progressBar.setMinPosition(this.position);
    }
    (this.cssType, `${this.position}%`);
    this.label.setPosition(this.position);
  }

  public setCurrent(value: number): void {
    this.current = value;
    this.setParentState('SET_CURRENT_MAX', 'SET_CURRENT_MIN', value);
  }

  public setIsActive(value: boolean): void {
    this.isActive = value;
  }

  private setParentState(typeOfMaxThumb: string, typeOfMinThumb: string, value: boolean | number): void {
    this.isMaxThumb ? this.init({type: typeOfMaxThumb, value}) : this.init({type: typeOfMinThumb, value});
  }

  public setPosition(value: number) {
    this.position = value;
    this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', value);
  }
}