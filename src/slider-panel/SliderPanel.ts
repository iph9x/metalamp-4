import '../slider/miSlider';
import isNumber from '../assets/ts/utils';

type Props = {
  max: number,
  min: number,
  isRange?: boolean,
  step?: number,
  from?: number,
  to?: number,
  hasLabels?: boolean,
  isVertical?: boolean,
  inputFromClass?: string,
  inputToClass?: string,
};

interface ISliderPanel {
  run(): void,
}

export default class SliderPanel implements ISliderPanel {
  private step: number;

  private inputFromClass: string;

  private from: number;

  private inputToClass: string;

  private to: number;

  private max: number;

  private min: number;

  private isRange: boolean;

  private hasLabels: boolean;

  private isVertical: boolean;

  private $panel: JQuery;

  private $slider: JQuery;

  private $inputFrom: JQuery;

  private $inputTo: JQuery;

  private $checkboxRange: JQuery;

  private $checkboxLabels: JQuery;

  private $checkboxVertical: JQuery;

  private $inputStep : JQuery;

  private $inputMin: JQuery;

  private $inputMax: JQuery;

  constructor(panelClassName: string, $slider: JQuery, state: Props) {
    Object.assign(this, state);
    this.$panel = $(panelClassName);
    this.$slider = $slider;
    this.$inputFrom = this.$panel.find('.js-slider-panel__input_option_current-from');
    this.$inputTo = this.$panel.find('.js-slider-panel__input_option_current-to');
  }

  public run(): void {
    this.initInputs();
    this.onInputsChange();
  }

  private getState(): Props {
    return ({
      max: this.max,
      min: this.min,
      step: this.step,
      from: this.from,
      to: this.to,
      inputFromClass: this.inputFromClass,
      inputToClass: this.inputToClass,
      isRange: this.isRange,
      hasLabels: this.hasLabels,
      isVertical: this.isVertical,
    });
  }

  private handleInputStepChange(e: Event): number | {} {
    const $target = $(e.currentTarget);
    const currentValue = Number($target.val());

    if (!isNumber(currentValue) || currentValue <= 0) {
      return $target.val(this.step || 1);
    }

    this.step = currentValue;
    if (this.inputFromClass) {
      this.from = Number(this.$inputFrom.val());
    }

    if (this.inputToClass) {
      this.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');

    return this.$slider.miSlider(this.getState());
  }

  private handleInputMinChange(e: Event): number | {} {
    const $target = $(e.currentTarget);
    const currentValue = Number($target.val());

    if ((currentValue >= this.max) || !isNumber(currentValue)) {
      return $target.val(this.min);
    }

    this.min = Number($target.val());
    if (this.inputFromClass) {
      this.from = Number(this.$inputFrom.val());
    }

    if (this.inputToClass) {
      this.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');

    return this.$slider.miSlider(this.getState());
  }

  private handleInputMaxChange(e: Event): number | {} {
    const $target = $(e.currentTarget);
    const currentValue = Number($target.val());

    if ((currentValue <= this.min) || !isNumber(currentValue)) {
      return $target.val(this.max);
    }

    this.max = Number($target.val());

    if (this.inputFromClass) {
      this.from = Number(this.$inputFrom.val());
    }

    if (this.inputToClass) {
      this.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');

    return this.$slider.miSlider(this.getState());
  }

  private handleInputRangeChange(e: Event): void {
    const $target = $(e.currentTarget);
    const isRange = $target.prop('checked');
    this.isRange = isRange;

    const from = Number(this.$inputFrom.val());
    let to = Number(this.$inputTo.val());
    if (this.inputFromClass && this.inputToClass) {
      if (isRange) {
        if (from >= to) {
          to = this.max;
        }
      }
    }

    if (this.inputFromClass) {
      this.from = from;
    }

    if (this.inputToClass) {
      this.to = to;
    }

    this.$slider.miSlider('destroy');
    this.$slider.miSlider(this.getState());
  }

  private handleLabelsVisibilityChange(e: Event): void {
    const $target = $(e.currentTarget);
    this.hasLabels = $target.prop('checked');

    if (this.inputFromClass) {
      this.from = Number(this.$inputFrom.val());
    }

    if (this.inputToClass) {
      this.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');
    this.$slider.miSlider(this.getState());
  }

  private handleCheckboxVerticalChange(e: Event): void {
    const $target = $(e.currentTarget);
    this.isVertical = $target.prop('checked');

    if (this.inputFromClass) {
      this.from = Number(this.$inputFrom.val());
    }

    if (this.inputToClass) {
      this.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');
    this.$slider.miSlider(this.getState());
  }

  private initInputs(): void {
    this.$checkboxRange = this.$panel.find('.js-slider-panel__checkbox_option_range');
    this.$checkboxLabels = this.$panel.find('.js-slider-panel__checkbox_option_labelsVisibility');
    this.$checkboxVertical = this.$panel.find('.js-slider-panel__checkbox_option_vertical');
    this.$inputStep = this.$panel.find('.js-slider-panel__input_option_step');
    this.$inputMin = this.$panel.find('.js-slider-panel__input_option_min');
    this.$inputMax = this.$panel.find('.js-slider-panel__input_option_max');

    this.$inputStep.val(this.step ? this.step : 1);
    this.$inputMin.val(this.min);
    this.$inputMax.val(this.max);
  }

  private onInputsChange(): void {
    this.$inputStep.on('change', this.handleInputStepChange.bind(this));
    this.$inputMin.on('change', this.handleInputMinChange.bind(this));
    this.$inputMax.on('change', this.handleInputMaxChange.bind(this));
    this.$checkboxRange.on('change', this.handleInputRangeChange.bind(this));
    this.$checkboxLabels.on('change', this.handleLabelsVisibilityChange.bind(this));
    this.$checkboxVertical.on('change', this.handleCheckboxVerticalChange.bind(this));
  }
}
