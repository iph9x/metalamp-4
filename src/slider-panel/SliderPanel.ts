import '../slider/miSlider';

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

  private localState: Props;

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
    this.localState = { ...state };
    this.$panel = $(panelClassName);
    this.$slider = $slider;
    this.$inputFrom = this.$panel.find('.js-slider-panel__input_option_current-from');
    this.$inputTo = this.$panel.find('.js-slider-panel__input_option_current-to');
  }

  public run(): void {
    this.initInputs();
    this.onInputsChange();
  }

  private isNumber(value: number): boolean {
    return value === Number(value);
  }

  private handleInputStepChange(e: Event): number | {} {
    const $target = $(e.currentTarget);
    const currentValue = Number($target.val());

    if (!this.isNumber(currentValue)) {
      return $target.val(this.localState.step || 1);
    }

    this.localState.step = currentValue;
    if (this.localState.inputFromClass) {
      this.localState.from = Number(this.$inputFrom.val());
    }

    if (this.localState.inputToClass) {
      this.localState.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');

    return this.$slider.miSlider(this.localState);
  };

  private handleInputMinChange(e: Event): number | {} {
    const $target = $(e.currentTarget);
    const currentValue = Number($target.val());

    if ((currentValue >= this.localState.max) || !this.isNumber(currentValue)) {
      return $target.val(this.localState.min);
    }

    this.localState.min = Number($target.val());
    if (this.localState.inputFromClass) {
      this.localState.from = Number(this.$inputFrom.val());
    }

    if (this.localState.inputToClass) {
      this.localState.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');

    return this.$slider.miSlider(this.localState);
  };

  private handleInputMaxChange(e: Event): number | {} {
    const $target = $(e.currentTarget);
    const currentValue = Number($target.val());

    if ((currentValue <= this.localState.min) || !this.isNumber(currentValue)) {
      return $target.val(this.localState.max);
    }

    this.localState.max = Number($target.val());

    if (this.localState.inputFromClass) {
      this.localState.from = Number(this.$inputFrom.val());
    }

    if (this.localState.inputToClass) {
      this.localState.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');

    return this.$slider.miSlider(this.localState);
  };

  private handleInputRangeChange(e: Event): void {
    const $target = $(e.currentTarget);
    const isRange = $target.prop('checked');
    this.localState.isRange = isRange;

    const from = Number(this.$inputFrom.val());
    let to = Number(this.$inputTo.val());
    if (this.localState.inputFromClass && this.localState.inputToClass) {
      if (isRange) {
        if (from >= to) {
          to = this.localState.max;
        }
      }
    }

    if (this.localState.inputFromClass) {
      this.localState.from = from;
    }

    if (this.localState.inputToClass) {
      this.localState.to = to;
    }

    this.$slider.miSlider('destroy');
    this.$slider.miSlider(this.localState);
  };

  private handleLabelsVisibilityChange(e: Event): void {
    const $target = $(e.currentTarget);
    this.localState.hasLabels = $target.prop('checked');

    if (this.localState.inputFromClass) {
      this.localState.from = Number(this.$inputFrom.val());
    }

    if (this.localState.inputToClass) {
      this.localState.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');
    this.$slider.miSlider(this.localState);
  };

  private handleCheckboxVerticalChange(e: Event): void {
    const $target = $(e.currentTarget);
    this.localState.isVertical = $target.prop('checked');

    if (this.localState.inputFromClass) {
      this.localState.from = Number(this.$inputFrom.val());
    }

    if (this.localState.inputToClass) {
      this.localState.to = Number(this.$inputTo.val());
    }

    this.$slider.miSlider('destroy');
    this.$slider.miSlider(this.localState);
  };

  private initInputs(): void {
    this.$checkboxRange = this.$panel.find('.js-slider-panel__checkbox_option_range');
    this.$checkboxLabels = this.$panel.find('.js-slider-panel__checkbox_option_labelsVisibility');
    this.$checkboxVertical = this.$panel.find('.js-slider-panel__checkbox_option_vertical');
    this.$inputStep = this.$panel.find('.js-slider-panel__input_option_step');
    this.$inputMin = this.$panel.find('.js-slider-panel__input_option_min');
    this.$inputMax = this.$panel.find('.js-slider-panel__input_option_max');
  
    this.$inputStep.val(this.localState.step ? this.localState.step : 1);
    this.$inputMin.val(this.localState.min);
    this.$inputMax.val(this.localState.max);
  }

  private onInputsChange(): void {
    this.$inputStep.on('change', (e: Event) => this.handleInputStepChange(e));
    this.$inputMin.on('change', (e: Event) => this.handleInputMinChange(e));
    this.$inputMax.on('change', (e: Event) => this.handleInputMaxChange(e));
    this.$checkboxRange.on('change', (e: Event) => this.handleInputRangeChange(e));
    this.$checkboxLabels.on('change', (e: Event) => this.handleLabelsVisibilityChange(e));
    this.$checkboxVertical.on('change', (e: Event) => this.handleCheckboxVerticalChange(e));
  }
}
