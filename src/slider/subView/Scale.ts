interface IScale {
  toThumbPosition: number,
  fromThumbPosition?: number,
  render(): JQuery,
  handleScaleMousedown(e: JQuery.Event): void,
}

type ScaleArgs = {
  step: number,
  min: number,
  max: number,
  fromThumbPosition: number,
  toThumbPosition: number,
  setFromThumb?: (e: JQuery.Event) => void,
  setFromThumbActive?: (value: boolean) => void,
  setToThumb: (e: JQuery.Event) => void,
  setToThumbActive: (value: boolean) => void,
  isRange?: boolean,
  isVertical?: boolean,
};

export default class Scale implements IScale {
  private $scale: JQuery = $('<div class="mi-slider__scale"></div>');

  private isSingle: boolean;

  private scaleNumbersArr: Array<number> = [];

  private min: number;

  private max: number;

  private step: number;

  public fromThumbPosition?: number;

  public toThumbPosition: number;

  private setFromThumb?: (e: JQuery.Event) => void;

  private setFromThumbActive?: (value: boolean) => void;

  private setToThumb: (e: JQuery.Event) => void;

  private setToThumbActive: (value: boolean) => void;

  private isVertical?: boolean;

  constructor({
    step,
    min,
    max,
    toThumbPosition,
    setToThumb,
    setToThumbActive,
    fromThumbPosition,
    setFromThumb,
    isVertical,
    setFromThumbActive,
    isRange,
  }: ScaleArgs) {
    this.isVertical = isVertical;

    if (this.isVertical) {
      this.$scale.addClass('mi-slider__scale_vertical');
    }

    this.min = min;
    this.max = max;
    this.step = step;
    this.toThumbPosition = toThumbPosition;
    this.fromThumbPosition = fromThumbPosition;
    this.setToThumb = setToThumb;
    this.setToThumbActive = setToThumbActive;
    this.setFromThumb = setFromThumb;
    this.setFromThumbActive = setFromThumbActive;

    this.isSingle = !isRange;
    this.renderNums();
    this.onScaleClick();
  }

  public handleScaleMousedown(e: JQuery.Event): void {
    e.preventDefault();
    let offset: number;
    const scaleClientRect = this.$scale.get(0).getBoundingClientRect();

    if (this.isVertical) {
      offset = ((e.clientY - scaleClientRect.top) * 100) / this.$scale.height();
    } else {
      offset = ((e.clientX - scaleClientRect.left) * 100) / this.$scale.width();
    }

    if (offset > 100) {
      offset = 100;
    } else if (offset < 0) {
      offset = 0;
    }

    this.setClosestThumbPos(offset, e);
  }

  public render(): JQuery {
    return this.$scale;
  }

  private onScaleClick(): void {
    const handleScaleMousedown = (e: JQuery.Event) => this.handleScaleMousedown(e);
    this.$scale.on('mousedown', handleScaleMousedown);
  }

  private setClosestThumbPos(offset: number, e: JQuery.Event): void {
    const offsetFromThumb = Math.abs(offset - this.fromThumbPosition);
    const offsetToThumb = Math.abs(offset - (100 - this.toThumbPosition));
    const offsetFromThumbIsLess = offsetToThumb <= offsetFromThumb;

    if (offsetFromThumbIsLess || this.isSingle) {
      this.setToThumbActive(true);
      this.setToThumb(e);
      $(document).on('mousemove', this.setToThumb.bind(this));
      $(document).on('mouseup', this.onMouseUp.bind(this, 'to'));
    } else {
      this.setFromThumbActive(true);
      this.setFromThumb(e);
      $(document).on('mousemove', this.setFromThumb.bind(this));
      $(document).on('mouseup', this.onMouseUp.bind(this, 'from'));
    }
  }

  private onMouseUp(thumb: 'from' | 'to') {
    if (thumb === 'from') {
      this.setFromThumbActive(false);
    } else {
      this.setToThumbActive(false);
    }

    $(document).off('mousemove');
  }

  private renderNums() {
    let maxMarksCount = Math.ceil((this.max - this.min) / this.step) + 1;

    if (maxMarksCount < 2) {
      maxMarksCount = 2;
    } else if (maxMarksCount > 100) {
      maxMarksCount = 101;
    }

    const scaleStep = (this.max - this.min) / (maxMarksCount - 1);

    for (let i = 0; i < maxMarksCount; i += 1) {
      if (i === 0) {
        this.scaleNumbersArr[i] = this.min;
      } else if (i === maxMarksCount - 1) {
        this.scaleNumbersArr[i] = this.max;
      } else {
        this.scaleNumbersArr[i] = Number((this.scaleNumbersArr[i - 1] + scaleStep).toFixed(1));
      }

      const $mark = $('<span class="mi-slider__scale-graduation"></span>');
      const visibleCaption = Math.round((maxMarksCount - 1) / 10);

      const marksCountIsMoreThanTen = maxMarksCount > 10;
      const captionNumberIsEven = i % visibleCaption === 0;
      const markIsLastOrMarksCountLessThan10 = i === maxMarksCount - 1 || maxMarksCount <= 10;
      const captionIsNotPenultimate = i !== maxMarksCount - 2 || maxMarksCount < 16;

      const captionsConditionsIsValid = marksCountIsMoreThanTen
        && captionNumberIsEven
        && captionIsNotPenultimate;

      if (captionsConditionsIsValid || markIsLastOrMarksCountLessThan10) {
        $mark.attr('data-before', `${this.scaleNumbersArr[i]}`);
        $mark.addClass('mi-slider__scale-graduation_numbered');
      }

      this.$scale.append($mark);
    }
  }
}
