import Label from '../subView/Label';
import Thumb from '../subView/Thumb';
import ProgressBar from '../subView/ProgressBar';
import Scale from '../subView/Scale';
import Observer from '../pattern/Observer';

interface IView {
  setStep(value: number): void,
  setMin(value: number): void,
  setMax(value: number): void,
  getFrom(): number,
  getTo(): number,
  setFrom(value: number): void,
  setTo(value: number): void,
  updateFrom(value: number): void,
  updateTo(value: number): void,
  update(action: { type: string, value: number }): void,
  run(): void,
}

type ViewArgs = {
  slider: JQuery,
  isRange?: boolean,
  hasLabels?: boolean,
  isVertical?: boolean,
  inputFromClass?: string,
  inputToClass?: string,
};

export default class View extends Observer implements IView {
  private fromThumbPosition: number;

  private toThumbPosition: number;

  private $wrapper = $('<div class="mi-slider__wrapper"></div>');

  private scale: Scale;

  private progressBar: ProgressBar;

  private fromThumb: Thumb;

  private toThumb: Thumb;

  private fromThumbLabel: Label;

  private toThumbLabel: Label;

  private $inputFrom: JQuery;

  private $inputTo: JQuery;

  private isVertical?: boolean;

  private max: number;

  private min: number;

  private $slider: JQuery;

  private isRange?: boolean;

  private step?: number;

  private from?: number;

  private to?: number;

  private hasLabels?: boolean;

  private inputFromClass?: string;

  private inputToClass?: string;

  constructor({
    slider,
    isRange,
    hasLabels,
    isVertical,
    inputFromClass,
    inputToClass,
  }: ViewArgs) {
    super();

    this.$slider = $(slider);
    this.isVertical = isVertical ?? false;
    this.isRange = isRange ?? true;
    this.inputFromClass = inputFromClass;
    this.inputToClass = inputToClass;
    this.hasLabels = hasLabels ?? true;
  }

  public run(): void {
    this.runConditionsBlock();

    this.$slider.addClass('mi-slider');

    this.progressBar = new ProgressBar(this.isRange, this.isVertical);

    this.changeInputFromValue(this.from);
    this.changeInputToValue(this.to);

    this.fromThumbPosition = (1 - (this.max - this.from) / (this.max - this.min)) * 100;
    this.toThumbPosition = ((this.max - this.to) / (this.max - this.min)) * 100;

    this.toThumbLabel = this.createToLabel();
    this.fromThumbLabel = this.createFromLabel();

    if (this.isRange) {
      this.fromThumb = this.createFromThumb();
      this.fromThumb.subscribe(this);
      this.fromThumbLabel.subscribe(this.fromThumb);

      this.initInputFrom();
    }

    this.toThumb = this.createToThumb();
    this.toThumb.subscribe(this);
    this.toThumbLabel.subscribe(this.toThumb);

    this.scale = this.createScale();

    this.progressBar.onProgressBarMousedown(this.scale.handleScaleMousedown.bind(this.scale));

    this.initInputTo();
    this.render(this.$slider);
  }

  public setMin(value: number) {
    this.min = value;
  }

  public setMax(value: number) {
    this.max = value;
  }

  public getTo(): number {
    return this.to;
  }

  public getFrom(): number {
    return this.from;
  }

  public setTo(value: number) {
    this.to = value;
  }

  public setFrom(value: number) {
    this.from = value;
  }

  public setStep(value: number) {
    this.step = value;
  }

  public updateFrom(value: number) {
    const newVal = this.checkNewFromValue(value);
    this.fromThumb.setPositionByValue(newVal);
  }

  public updateTo(value: number) {
    const newVal = this.checkNewToValue(value);
    this.toThumb.setPositionByValue(newVal);
  }

  public update(action: { type: string, value: number }): void {
    const { type, value } = action;

    switch (type) {
      case ('SET_CURRENT_MAX'):
        this.setCurrentMax(value);
        break;
      case ('SET_CURRENT_MIN'):
        this.setCurrentMin(value);
        break;
      case ('SET_TO_THUMB_POSITION'):
        this.toThumbPosition = value;
        if (this.isRange) {
          this.fromThumb.otherThumbPosition = value;
        }

        this.scale.toThumbPosition = value;
        break;
      case ('SET_FROM_THUMB_POSITION'):
        this.fromThumbPosition = value;
        this.toThumb.otherThumbPosition = value;
        this.scale.fromThumbPosition = value;
        break;
      default:
        break;
    }
  }

  private handleInputFromBlur(e: Event) {
    const val = this.checkNewFromValue(Number($(e.target).val()));
    this.fromThumb.setPositionByValue(val);
  }

  private initInputFrom(): void {
    if (this.inputFromClass) {
      this.$inputFrom.off();
      this.$inputFrom.on('blur', this.handleInputFromBlur.bind(this));
    }
  }

  private handleInputToBlur(e: Event) {
    const val = this.checkNewToValue(Number($(e.target).val()));
    this.toThumb.setPositionByValue(val);
  }

  private initInputTo(): void {
    if (this.$inputTo) {
      this.$inputTo.off();
      this.$inputTo.on('blur', this.handleInputToBlur.bind(this));
    }
  }

  private runConditionsBlock(): void {
    if (!this.isRange) {
      this.from = this.min;
    }

    if (this.isVertical) {
      (this.$wrapper).addClass('mi-slider__wrapper_vertical');
    }

    if (this.inputFromClass) {
      this.$inputFrom = $(`.${this.inputFromClass}`);
    }

    if (this.inputToClass) {
      this.$inputTo = $(`.${this.inputToClass}`);
    }

    if (!this.isRange && this.$inputFrom) {
      $(this.$inputFrom).attr('disabled', 'disabled');
    } else {
      $(this.$inputFrom).removeAttr('disabled');
    }
  }

  private checkNewFromValue(value: number): number {
    let val = value;

    val = Number.isNaN(val) ? this.from : val;
    val = val >= this.to ? this.from : val;
    val = val < this.min ? this.from : val;

    return val;
  }

  private checkNewToValue(value: number): number {
    let val = value;

    val = Number.isNaN(val) ? this.to : val;
    val = val > this.max ? this.max : val;
    val = val <= this.from ? this.to : val;

    return val;
  }

  private setCurrentMax(value: number): void {
    this.to = value;
    this.fire({ type: 'SET_TO_VALUE', value });

    this.changeInputToValue(value);
  }

  private setCurrentMin(value: number): void {
    this.from = value;
    this.fire({ type: 'SET_FROM_VALUE', value });

    this.changeInputFromValue(value);
  }

  private changeInputFromValue(value: number): void {
    if (typeof this.inputFromClass !== 'undefined') {
      this.$inputFrom.val(value);
    }
  }

  private changeInputToValue(value: number): void {
    if (typeof this.inputToClass !== 'undefined') {
      this.$inputTo.val(value);
    }
  }

  private createToLabel(): Label {
    return new Label({
      value: this.to,
      type: 'toThumb',
      position: this.toThumbPosition,
      isVertical: this.isVertical,
    });
  }

  private createFromLabel(): Label {
    return new Label({
      value: this.from,
      type: 'fromThumb',
      position: this.fromThumbPosition,
      isVertical: this.isVertical,
    });
  }

  private createFromThumb(): Thumb {
    return new Thumb({
      type: 'fromThumb',
      startPosition: this.from,
      label: this.fromThumbLabel,
      step: this.step,
      $wrapper: this.$wrapper,
      progressBar: this.progressBar,
      max: this.max,
      min: this.min,
      otherThumbPosition: this.toThumbPosition,
      isVertical: this.isVertical,
    });
  }

  private createToThumb(): Thumb {
    return new Thumb({
      type: 'toThumb',
      startPosition: this.to,
      label: this.toThumbLabel,
      step: this.step,
      $wrapper: this.$wrapper,
      progressBar: this.progressBar,
      max: this.max,
      min: this.min,
      otherThumbPosition: this.fromThumbPosition,
      isVertical: this.isVertical,
      isRange: this.isRange,
    });
  }

  private createScale(): Scale {
    return new Scale({
      step: this.step,
      min: this.min,
      max: this.max,
      toThumbPosition: this.toThumbPosition,
      setToThumb: this.toThumb.handleThumbMove,
      setToThumbActive: this.toThumb.setIsActive,
      fromThumbPosition: this.fromThumbPosition,
      setFromThumb: this.fromThumb?.handleThumbMove,
      isVertical: this.isVertical,
      setFromThumbActive: this.fromThumb?.setIsActive,
      isRange: this.isRange,
    });
  }

  private render(root: JQuery): void {
    if (this.isRange) {
      this.$wrapper.append(this.fromThumb.render());
    }

    this.$wrapper
      .append(this.toThumb.render())
      .append(this.scale.render())
      .append(this.progressBar.render());

    if (this.hasLabels) {
      if (this.isRange) {
        this.$wrapper.append(this.fromThumbLabel.render());
      }

      this.$wrapper.append(this.toThumbLabel.render());
    }

    root.append(this.$wrapper);
  }
}
