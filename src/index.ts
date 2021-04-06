import './styles/main.scss';
import './styles/configPanel.scss';
import './ts/miSlider.ts';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  defaultMin?: number,
  defaultMax?: number,
  labels?: boolean,
  vertical?: boolean,
  inputsId?: {
    inputFromId: string,
    inputToId: string,
  }
}

const localState1: Props = {
  min: 500,
  max: 1200,
  defaultMin: 500,
  defaultMax: 1000,
  range: true,
  step: 5,
  labels: true,
  vertical: true,
  inputsId: {
    inputFromId: 'first-input-1',
    inputToId: 'second-input-1'
  },
}

const localState2: Props = {
  min: 700,
  max: 1200,
  defaultMin: 900,
  defaultMax: 1000,
  step: 1,
  labels: true,
  inputsId: {
    inputFromId: 'first-input',
    inputToId: 'second-input'
  },
}
const localState3: Props = {
  min: 0,
  max: 100,
  inputsId: {
    inputFromId: 'first-input-3',
    inputToId: 'second-input-3'
  }
}

$('.slider').miSlider(localState1);
$('.slider-2').miSlider(localState2);
$('.slider-3').miSlider(localState3);

function setSliderPanelHandlers(panelName: string, sliderName: string, state: Props): void {
  $(panelName).find('.slider-panel__step').val(state.step ? state.step : 1);
  $(panelName).find('.slider-panel__min').val(state.min);
  $(panelName).find('.slider-panel__max').val(state.max);

  $(panelName).on('change', '.slider-panel__step', function () {
    state.step = Number($(this).val());
    state.defaultMin = Number($(panelName).find('.slider-panel__current-from').val());
    state.defaultMax = Number($(panelName).find('.slider-panel__current-to').val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__min', function () {
    state.min = Number($(this).val());
    state.defaultMin = Number($(panelName).find('.slider-panel__current-from').val());
    state.defaultMax = Number($(panelName).find('.slider-panel__current-to').val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__max', function () {
    state.max = Number($(this).val());
    state.defaultMin = Number($(panelName).find('.slider-panel__current-from').val());
    state.defaultMax = Number($(panelName).find('.slider-panel__current-to').val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__current-from', function () {
    state.defaultMin = Number($(this).val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__current-to', function () {
    state.defaultMax = Number($(this).val());
    $(sliderName).miSlider(state);
  });  
  $(panelName).on('change', '.slider-panel__range', function () {
    state.range = this.checked;
    state.defaultMin = Number($(panelName).find('.slider-panel__current-from').val());
    state.defaultMax = Number($(panelName).find('.slider-panel__current-to').val());

    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__labelsVisibility', function () {
    state.labels = this.checked;
    state.defaultMin = Number($(panelName).find('.slider-panel__current-from').val());
    state.defaultMax = Number($(panelName).find('.slider-panel__current-to').val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__vertical', function () {
    state.vertical = this.checked;
    state.defaultMin = Number($(panelName).find('.slider-panel__current-from').val());
    state.defaultMax = Number($(panelName).find('.slider-panel__current-to').val());
    $(sliderName).miSlider(state);
  });
}

setSliderPanelHandlers('.slider-panel-2', '.slider-2', localState2);
setSliderPanelHandlers('.slider-panel-1', '.slider', localState1);
setSliderPanelHandlers('.slider-panel-3', '.slider-3', localState3);