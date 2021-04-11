import Label from '../subVeiw/label';
import ProgressBar from '../subVeiw/progressBar';
import Observer from '../pattern/observer';

export interface IThumb {
  setPositionHandler(e: JQuery.Event): void,
  setIsActive(value: boolean): void,
  render(): JQuery,
  otherThumbPosition?: number
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
  vertical?: boolean;
  isRange?: boolean;
}

export default class Thumb extends Observer implements IThumb {
  private _thumb: JQuery = $('<span class="mi-slider__circle"></span>');
  private _shift: number = 0;
  private _isActive: boolean = false;
  private _current: number;
  private _isMaxThumb: boolean;
  private _position: number;
  private _type: 'minThumb' | 'maxThumb';
  private _label: Label;
  private _step: number;
  private _wrapper: JQuery;
  private _progressBar: ProgressBar;
  private _max: number;
  private _min: number;
  private _isVertical?: boolean;
  private _isRange?: boolean;
  private cssType: string;
  
  public otherThumbPosition?: number;

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
    vertical,
    isRange
  }: Props) {
    super();

    this._type = type;
    this._label = label;
    this._step = step;
    this._wrapper = wrapper;
    this._progressBar = progressBar;
    this._max = max;
    this._min = min;
    this.otherThumbPosition = otherThumbPosition;
    this._isVertical = vertical;
    this._isRange = isRange;

    if (this._type === 'minThumb') {
      if (this._isVertical) {
        this.cssType = 'top';
      } else {
        this.cssType = 'left';
      }
    } else {
      if (this._isVertical) {
        this.cssType = 'bottom';
      } else {
        this.cssType = 'right';
      }
    }

    this._thumb.addClass(`mi-slider__circle_${this.cssType}`);
    this._isMaxThumb = this._type === 'maxThumb'; 

    this._current = this._isMaxThumb ? max : min;

    this.setPositionByVal(startPosition)
    this.render();

    this.onThumbClick();
    this.onThumbMouseUp();

    this.setPositionHandler = this.setPositionHandler.bind(this);
    this._calcNewPos = this._calcNewPos.bind(this);
    this.setIsActive = this.setIsActive.bind(this);
  }
  
  render(): JQuery {
    return this._thumb;
  }

  private onThumbClick() {
    this._thumb.on('mousedown', (e: JQuery.Event) => this.clickHandler(e))
  }

  public clickHandler(e: JQuery.Event): void {
    e.preventDefault();

    this.setIsActive(true);
    this._shift = this._isVertical ? this._calcShift(e.clientY, 'top', 'height') : this._calcShift(e.clientX, 'left', 'width');
    $('html').css('cursor', 'pointer');

    this.onThumbMove();
  }

  private onThumbMove() {
    $(document).on('mousemove', (e: JQuery.Event) => this.setPositionHandler(e))
  }

  public setPositionHandler(e: JQuery.Event): void {
    if (!this._isActive) return;
    
    let calcedX: number = this._calcNewPos(e.clientX, 'left', 'width');
    let calcedY: number = this._calcNewPos(e.clientY, 'top', 'height');

    let newPosition: number;
    
    if (this._isMaxThumb) {
      newPosition = this._isVertical ? 100 - calcedY : 100 - calcedX;
    } else {
      newPosition = this._isVertical ? calcedY : calcedX;
    }

    newPosition = this._checkBorders(newPosition, this.otherThumbPosition);

    if (this._isMaxThumb) {
      this._progressBar.setMaxPosition(newPosition);
      let value = Math.round((this._min + (1 - newPosition / 100) * (this._max - this._min)) / this._step) * this._step;
      value = value > this._max ? this._max : value;
      
      this._current = value;
      this.init({type: 'SET_CURRENT_MAX', value});
    } else {
      this._progressBar.setMinPosition(newPosition);
      let value = Math.round((this._min + (newPosition / 100) * (this._max - this._min)) / this._step) * this._step;
      value = value < this._min ? this._min : value;

      this._current = value;
      this.init({type: 'SET_CURRENT_MIN', value});
    }

    this._thumb.css(this.cssType, `${newPosition}%`);
    this._label.setPosition(newPosition);
    this._label.setValue(this._current);
    this._position = newPosition;

    this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', newPosition);
  }

  private onThumbMouseUp() {
    $(document).on('mouseup', () => {
      if (this._isActive) {
        this.setIsActive(false);

        $('html').css('cursor', 'default');
        $(document).off('mousemove');

        this._shift = 0;
      }
    });
  }

  private _getValueToPercent(val: number): number {
    return val / (this._max - this._min) * 100;
  }

  private _calcShift (mousePos: number, type: 'top' | 'left', dimension: 'width' | 'height'): number {
    return mousePos - this._thumb.get(0).getBoundingClientRect()[type] - (this._thumb[dimension]() / 2);
  }

  private _calcNewPos (mousePos: number, type: 'left' | 'top', dimension: 'height' | 'width'): number {
    return (mousePos - this._shift - this._wrapper.get(0).getBoundingClientRect()[type]) * 100 / this._wrapper[dimension]();
  }

  private _checkBorders = (position: number, border: number): number => {
    const stepInPercent = this._getValueToPercent(this._step);
    if (typeof this._isRange !== 'undefined' && !this._isRange) {
      if (position < 0) {
        return 0;
      } 
      if (position > 100) {
        return 100;
      }
      return position;
    }
    if (position < 0) {
      return 0;
    } 
    if (Number((position).toFixed(8)) >= Number((100 - border - stepInPercent).toFixed(8))) {
      if (100 - border - stepInPercent < 0)  {
        return 0;
      }
      return 100 - border - stepInPercent;
    }
    if (position > 100) {
      return 100;
    }
    return position;
  } 

  public setPositionByVal(val: number): void {
    if (val < this._min) {
      this._position = 0;
    } else if (val > this._max) {
      this._position = 100;
    } else if (this._isMaxThumb) {
      this._position = this._getValueToPercent(this._max - val);
    } else {
      this._position = 100 - this._getValueToPercent(this._max - val);
    }
    this.setCurrent(val);
    this._thumb.css(this.cssType, `${this._position}%`);
    this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', this._position);
    if (this._isMaxThumb) {
      this._progressBar.setMaxPosition(this._position);
    } else {
      this._progressBar.setMinPosition(this._position);
    }
    (this.cssType, `${this._position}%`);
    this._label.setPosition(this._position);
    this._label.setValue(val);
  }

  public setCurrent(value: number): void {
    this._current = value;
    this.setParentState('SET_CURRENT_MAX', 'SET_CURRENT_MIN', value);
  }

  public setIsActive(value: boolean): void {
    this._isActive = value;
  }

  private setParentState(typeOfMaxThumb: string, typeOfMinThumb: string, value: boolean | number): void {
    this._isMaxThumb ? this.init({type: typeOfMaxThumb, value}) : this.init({type: typeOfMinThumb, value});
  }

  public setPosition(value: number) {
    this._position = value;
    this.setParentState('SET_MAX_THUMB_POSITION', 'SET_MIN_THUMB_POSITION', value);
  }
}