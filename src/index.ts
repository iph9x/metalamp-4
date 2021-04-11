import './styles/main.scss';
import './styles/configPanel.scss';
import './ts/miSlider.ts';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  defaultFromValue?: number,
  defaultToValue?: number,
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
  defaultFromValue: 500,
  defaultToValue: 1000,
  range: true,
  // step: 5,
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
  defaultFromValue: 900,
  defaultToValue: 1000,
  // step: 1,
  labels: true,
  inputsId: {
    inputFromId: 'first-input',
    inputToId: 'second-input'
  },
}
const localState3: Props = {
  min: 33,
  max: 55,
  step: 1,
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

  const inputFrom = $(panelName).find('.slider-panel__current-from');
  const inputTo = $(panelName).find('.slider-panel__current-to');

  $(panelName).on('change', '.slider-panel__step', function () {
    state.step = Number($(this).val());
    state.defaultFromValue = Number(inputFrom.val());
    state.defaultToValue = Number(inputTo.val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__min', function () {
    state.min = Number($(this).val());
    state.defaultFromValue = Number(inputFrom.val());
    state.defaultToValue = Number(inputTo.val());

    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__max', function () {
    state.max = Number($(this).val());
    state.defaultFromValue = Number(inputFrom.val());
    state.defaultToValue = Number(inputTo.val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__range', function () {
    state.range = this.checked;
    let from = Number(inputFrom.val());
    let to = Number(inputTo.val());
    if (this.checked) {
      if (from >= to) {
        to = state.max;
      }
    }
    state.defaultFromValue = from;
    state.defaultToValue = to;

    $(sliderName).miSlider(state);
  });
  inputFrom.on('blur', (e: Event) => {
    let val = Number($(e.target).val());

    val = isNaN(val) ? state.defaultFromValue : val;  
    val = val >= state.defaultToValue ? state.defaultFromValue : val;
    val = val < state.min ? state.min : val;

    state.defaultFromValue = val;
    console.log(state)
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__labelsVisibility', function () {
    state.labels = this.checked;
    state.defaultFromValue = Number(inputFrom.val());
    state.defaultToValue = Number(inputTo.val());
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__vertical', function () {
    state.vertical = this.checked;
    state.defaultFromValue = Number(inputFrom.val());
    state.defaultToValue = Number(inputTo.val());
    $(sliderName).miSlider(state);
  });
}

setSliderPanelHandlers('.slider-panel-1', '.slider', localState1);
setSliderPanelHandlers('.slider-panel-2', '.slider-2', localState2);
setSliderPanelHandlers('.slider-panel-3', '.slider-3', localState3);