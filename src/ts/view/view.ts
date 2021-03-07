import LabelSubView from '../subVeiw/label';

export interface ViewInterface {
  max: number,
  min?: number,
  currentMin: number,
  currentMax: number,
  isRange?: boolean,
  slider: object,
  step?: number,
}

export default class View implements ViewInterface {
  public max: number;
  public min?: number;
  public currentMin: number;
  public currentMax: number;
  public isRange?: boolean;
  public slider: object;
  public step?: number;

  private rightStartPos: number | null;
  private rightThumbActive: boolean = false;
  private rightThumbPosition: number;
  
  private leftStartPos: number | null;
  private leftThumbActive: boolean = false;
  private leftThumbPosition: number;

  private shiftRightX: number;
  private shiftLeftX: number;

  private leftThumb = $('<span class="mi-slider__circle mi-slider__circle_left"></span>');
  private rightThumb = $('<span class="mi-slider__circle mi-slider__circle_right"></span>');
  private rightLabel: LabelSubView;
  private leftLabel: LabelSubView;
  private track  = $('<div class="mi-slider__track"></div>');
  private wrapperBlock = $('<div class="mi-slider__wrapper"></div>');
  
  constructor(max: number, min: number, range: boolean, slider: object, step?: number,  defaultMin?: number, defaultMax?: number) {

    this.isRange = range;
    this.min = min || 0;
    this.max = max || 100;

    this.rightStartPos = defaultMax;

    this.leftStartPos = defaultMin;


    this.slider = slider;
    const that = $(this.slider);

    that.addClass('mi-slider');

    this.step = step ? step : (this.max - this.min) / $(this.slider).width();

    this.setCurrentMin(min || 0);
    this.setCurrentMax(max || 100);

    this.setLeftPositionByVal(this.leftStartPos);
    this.setRightPositionByVal(this.rightStartPos);

    this.rightLabel = new LabelSubView(defaultMax, 'right', this.rightThumbPosition);
    this.leftLabel = new LabelSubView(defaultMin, 'left', this.leftThumbPosition);

    $(this.track).css('left',  `${this.leftThumbPosition}%`);
    $(this.track).css('right',  `${this.rightThumbPosition}%`);
    $(this.rightThumb).css('right',  `${this.rightThumbPosition}%`);
    if (this.isRange) {
      $(this.leftThumb).css('left', `${this.leftThumbPosition}%`);
    }

    if (this.isRange) {
      this.wrapperBlock.append(this.leftThumb)
    }
    this.wrapperBlock
      .append(this.rightThumb)
      .append(this.track)
      .append(this.rightLabel.render())
      .append(this.leftLabel.render());

    that.append(this.wrapperBlock);

    this.onRightThumbClick();
    this.onRightThumbMouseUp();
    this.onRightThumbMove();
    this.onLeftThumbClick();
    this.onLeftThumbMouseUp();
    this.onLeftThumbMove();
  }


  onRightThumbClick() {
    this.rightThumb.on('mousedown', (e: any) => {
      e.preventDefault();
      this.rightThumbActive = true;
      
      this.rightLabel.show();

      this.shiftRightX = e.pageX - this.rightThumb.get(0).getBoundingClientRect().left - (this.rightThumb.width() / 2);
    });
  }

  onRightThumbMove() {
    $(document).on('mousemove', (e: any) => {
      if (this.rightThumbActive === false) return;

      let step = this.getValueToPercent(this.step);
      let newRightThumbPos: number = 100 - (e.pageX - this.shiftRightX - this.wrapperBlock.get(0).getBoundingClientRect().left) * 100 / this.wrapperBlock.width();
      

      newRightThumbPos = 100 - Math.round(((100 - newRightThumbPos) / step)) * step;

      newRightThumbPos = this.checkBorders(newRightThumbPos, this.leftThumbPosition);
      this.rightThumb.css('right', `${newRightThumbPos}%`);
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
    this.leftThumb.on('mousedown', (e: any) => {
      e.preventDefault();
      this.leftThumbActive = true;
      
      this.leftLabel.show();

      this.shiftLeftX = e.pageX - this.leftThumb.get(0).getBoundingClientRect().left - (this.leftThumb.width() / 2);
    });
  }

  onLeftThumbMove() {
    $(document).on('mousemove', (e: any) => {
      if (this.leftThumbActive === false) return;

      let step = this.getValueToPercent(this.step);
      let newLeftThumbPos: number = (e.pageX - this.shiftLeftX - this.wrapperBlock.get(0).getBoundingClientRect().left) * 100 / this.wrapperBlock.width();

      newLeftThumbPos = Math.round((newLeftThumbPos / step)) * step;

      newLeftThumbPos = this.checkBorders(newLeftThumbPos, this.rightThumbPosition);
      this.leftThumb.css('left', `${newLeftThumbPos}%`);
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
    return val / (this.max - this.min) * 100;
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
  }

  public setCurrentMin(min: number): void {
    this.currentMin = min;
  }
}