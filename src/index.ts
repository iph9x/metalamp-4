import './styles/main.scss';
import './ts/miSlider';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  from?: number,
  to?: number,
  hasLabels?: boolean,
  isVertical?: boolean,
  inputFromId?: string,
  inputToId?: string,
};

const sliderState1: Props = {
  min: 500,
  max: 1200,
  from: 500,
  to: 1000,
  range: true,
  hasLabels: true,
  isVertical: true,
  inputFromId: 'first-input-1',
  inputToId: 'second-input-1',
};

const sliderState2: Props = {
  min: 700,
  max: 1200,
  from: 900,
  to: 1000,
  hasLabels: true,
  inputFromId: 'first-input-2',
  inputToId: 'second-input-2',
};

const sliderState3: Props = {
  min: 33,
  max: 55,
  step: 1,
  hasLabels: false,
  range: false,
  inputFromId: 'first-input-3',
  inputToId: 'second-input-3',
};

$('.js-slider').miSlider(sliderState1);
$('.js-slider-2').miSlider(sliderState2);
$('.js-slider-3').miSlider(sliderState3);

const isNumber = (value: number) => value === Number(value);

function setSliderPanelHandlers(panelName: string, sliderName: string, state: Props): void {
  const localState = { ...state };
  const panel = $(panelName);
  const slider = $(sliderName);
  const inputFrom = panel.find('.slider-panel__current-from');
  const inputTo = panel.find('.slider-panel__current-to');

  const handleInputStepChange = (e: Event) => {
    const target = $(e.currentTarget);
    const currentValue = Number(target.val());

    if (!isNumber(currentValue)) {
      return target.val(localState.step || 1);
    }

    localState.step = currentValue;
    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }

    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    slider.miSlider('destroy');
    return slider.miSlider(localState);
  };
  const handleInputMinChange = (e: Event) => {
    const target = $(e.currentTarget);
    const currentValue = Number(target.val());

    if ((currentValue >= localState.max) || !isNumber(currentValue)) {
      return target.val(localState.min);
    }

    localState.min = Number(target.val());
    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }

    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    slider.miSlider('destroy');
    return slider.miSlider(localState);
  };
  const handleInputMaxChange = (e: Event) => {
    const target = $(e.currentTarget);
    const currentValue = Number(target.val());

    if ((currentValue <= localState.min) || !isNumber(currentValue)) {
      return target.val(localState.max);
    }

    localState.max = Number(target.val());

    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }

    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    slider.miSlider('destroy');
    return slider.miSlider(localState);
  };
  const handleInputRangeChange = (e: Event) => {
    const target = $(e.currentTarget);
    const isRange = target.prop('checked');
    localState.range = isRange;

    const from = Number(inputFrom.val());
    let to = Number(inputTo.val());
    if (localState.inputFromId && localState.inputToId) {
      if (isRange) {
        if (from >= to) {
          to = localState.max;
        }
      }
    }

    if (localState.inputFromId) {
      localState.from = from;
    }

    if (localState.inputToId) {
      localState.to = to;
    }

    slider.miSlider('destroy');
    slider.miSlider(localState);
  };
  const handleLabelsVisibilityChange = (e: Event) => {
    const target = $(e.currentTarget);
    localState.hasLabels = target.prop('checked');

    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }

    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    slider.miSlider('destroy');
    slider.miSlider(localState);
  };
  const handleCheckboxVerticalChange = (e: Event) => {
    const target = $(e.currentTarget);
    localState.isVertical = target.prop('checked');

    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }

    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    slider.miSlider('destroy');
    slider.miSlider(localState);
  };

  const checkboxRange = panel.find('.slider-panel__range');
  const checkboxLabels = panel.find('.slider-panel__labelsVisibility');
  const checkboxVertical = panel.find('.slider-panel__vertical');
  const inputStep = panel.find('.slider-panel__step');
  const inputMin = panel.find('.slider-panel__min');
  const inputMax = panel.find('.slider-panel__max');

  inputStep.val(localState.step ? localState.step : 1);
  inputMin.val(localState.min);
  inputMax.val(localState.max);

  inputStep.on('change', handleInputStepChange);
  inputMin.on('change', handleInputMinChange);
  inputMax.on('change', handleInputMaxChange);
  checkboxRange.on('change', handleInputRangeChange);
  checkboxLabels.on('change', handleLabelsVisibilityChange);
  checkboxVertical.on('change', handleCheckboxVerticalChange);
}

setSliderPanelHandlers('.slider-panel-1', '.slider', sliderState1);
setSliderPanelHandlers('.slider-panel-2', '.slider-2', sliderState2);
setSliderPanelHandlers('.slider-panel-3', '.slider-3', sliderState3);
