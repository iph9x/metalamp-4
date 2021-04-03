import './styles/main.scss';
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

$('.slider').miSlider({
  min: 500,
  max: 1200,
  defaultMin: 500,
  defaultMax: 1000,
  range: true,
  step: 5,
  labels: true,
  vertical: true
});

$('.slider-2').miSlider({
  min: 700,
  max: 1200,
  defaultMin: 600,
  defaultMax: 1000,
  step: 1,
  labels: true,
  inputsId: {
    inputFromId: 'first-input',
    inputToId: 'second-input'
  }
});

const localState2: Props = {
  min: 700,
  max: 1200,
  defaultMin: 600,
  defaultMax: 1000,
  step: 1,
  labels: true,
  inputsId: {
    inputFromId: 'first-input',
    inputToId: 'second-input'
  },
}



function setSliderPanelHandlers(panelName: string, sliderName: string, state: Props): void {
  $(panelName).find('.slider-panel__step').val(state.step ? state.step : 1);

  $(panelName).on('change', '.slider-panel__step', function () {
    state.step = Number($(this).val());
    $(sliderName).miSlider(state);
  });
  // $(panelName).on('change', '.slider-panel__min', function () {
  //   state.min = Number($(this).val());
  //   $(sliderName).miSlider(state);
  // });
  // $(panelName).on('change', '.slider-panel__max', function () {
  //   state.max = Number($(this).val());
  //   $(sliderName).miSlider(state);
  // });
  
  $(panelName).on('change', '.slider-panel__range', function () {
    state.range = this.checked;
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__labelsVisibility', function () {
    state.labels = this.checked;
    $(sliderName).miSlider(state);
  });
  $(panelName).on('change', '.slider-panel__vertical', function () {
    state.vertical = this.checked;
    $(sliderName).miSlider(state);
  });
}

setSliderPanelHandlers('.slider-panel-2', '.slider-2', localState2);