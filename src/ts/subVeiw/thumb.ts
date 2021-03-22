import Label from '../subVeiw/label';

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
  track: JQuery;
  max: number;
  min: number;
  otherThumbPosition?: number;
  vertical?: boolean
}

export default class Thumb implements IThumb {
  public getValueToPercent: () => number;
  private thumb: JQuery = $('<span class="mi-slider__circle"></span>');
  private shift: number;
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
  private track: JQuery;
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
    track,
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
    this.track = track;
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
    this.onThumbMove();
    this.onThumbMouseUp();
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

  onThumbClick() {
    this.thumb.on('mousedown', (e: JQuery.Event) => {
      e.preventDefault();

      this.setIsActive(true)

      this.label.show();
      if (this.vertical) {
        this.shift = e.pageY - this.thumb.get(0).getBoundingClientRect().top - (this.thumb.height() / 2);
      } else {
        this.shift = e.pageX - this.thumb.get(0).getBoundingClientRect().left - (this.thumb.width() / 2);
      }
      $('html').css('cursor', 'pointer');
    })
  }

  onThumbMove() {
    $(document).on('mousemove', (e: JQuery.Event) => {
      if (this.isActive === false) return;

      let step = this.step;
      let newPosition: number;
      if (this.isMaxThumb) {
        if (this.vertical) {
          newPosition = 100 - (e.pageY - this.shift - this.wrapper.get(0).getBoundingClientRect().top) * 100 / this.wrapper.height();
        } else {
          newPosition = 100 - (e.pageX - this.shift - this.wrapper.get(0).getBoundingClientRect().left) * 100 / this.wrapper.width();
        }
        newPosition = 100 - Math.round(((100 - newPosition) / step)) * step;
      } else {
        if (this.vertical) {
          newPosition = (e.pageY - this.shift - this.wrapper.get(0).getBoundingClientRect().top) * 100 / this.wrapper.height()
        } else {
          newPosition = (e.pageX - this.shift - this.wrapper.get(0).getBoundingClientRect().left) * 100 / this.wrapper.width()
        }
        newPosition = Math.round((newPosition / step)) * step;
      }

      newPosition = this.checkBorders(newPosition, this.otherThumbPosition);

      this.thumb.css(this.cssType, `${newPosition}%`);
      this.track.css(this.cssType, `${newPosition}%`);
      
      this.label.setPosition(newPosition);

      this.position = newPosition;
      this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', newPosition);
  
      if (this.isMaxThumb) {
        let value = Math.round(this.min + (1 - newPosition / 100) * (this.max - this.min))
        this.current = value;
        this.init({type: 'SET_CURRENT_MAX', value})
      } else {

        let value = Math.round(this.min + (newPosition / 100) * (this.max - this.min));
        this.current = value;
        this.init({type: 'SET_CURRENT_MIN', value})
      }

      this.label.setValue(this.current);
    })
  }

  onThumbMouseUp() {
    $(document).on('mouseup', () => {
      if (this.isActive) {
        this.setIsActive(false);
        this.label.hide();

        $('html').css('cursor', 'default');
      }
    });
  }

  checkBorders = (position: number, border: number): number => {
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

  setPositionByVal(val: number): void {
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
    this.track.css(this.cssType,  `${this.position}%`);
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
    if (this.type === 'maxThumb') {
      this.init({type: typeOfMaxThumb, value})
    } else {
      this.init({type: typeOfMinThumb, value})
    }
  }

  public setPosition(value: number) {
    this.position = value;
  }
}