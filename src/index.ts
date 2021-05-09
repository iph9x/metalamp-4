import './styles/main.scss';
import './styles/configPanel.scss';
import './ts/miSlider';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  from?: number,
  to?: number,
  labels?: boolean,
  vertical?: boolean,
  inputFromId?: string,
  inputToId?: string,
};

const localState1: Props = {
  min: 500,
  max: 1200,
  from: 500,
  to: 1000,
  range: true,
  labels: true,
  vertical: true,
  inputFromId: 'first-input-1',
  inputToId: 'second-input-1',
};

const localState2: Props = {
  min: 700,
  max: 1200,
  from: 900,
  to: 1000,
  labels: true,
  inputFromId: 'first-input-2',
  inputToId: 'second-input-2',
};

const localState3: Props = {
  min: 33,
  max: 55,
  step: 1,
  labels: false,
  range: false,
  inputFromId: 'first-input-3',
  inputToId: 'second-input-3',
};
$('.slider').miSlider(localState1);
$('.slider-2').miSlider(localState2);
$('.slider-3').miSlider(localState3);

const isNumber = (value: number) => value === +value;

function setSliderPanelHandlers(panelName: string, sliderName: string, state: Props): void {
  const localState = { ...state };

  $(panelName).find('.slider-panel__step').val(localState.step ? localState.step : 1);
  $(panelName).find('.slider-panel__min').val(localState.min);
  $(panelName).find('.slider-panel__max').val(localState.max);

  const inputFrom = $(panelName).find('.slider-panel__current-from');
  const inputTo = $(panelName).find('.slider-panel__current-to');

  $(panelName).on('change', '.slider-panel__step', function stepHandler() {
    const currentValue = Number($(this).val());

    if (!isNumber(currentValue)) {
      return $(this).val(localState.step || 1);
    }
    localState.step = currentValue;
    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }
    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    $(sliderName).miSlider('destroy');
    return $(sliderName).miSlider(localState);
  });
  $(panelName).on('change', '.slider-panel__min', function minHandler() {
    const currentValue = Number($(this).val());

    if ((currentValue >= localState.max) || !isNumber(currentValue)) {
      return $(this).val(localState.min);
    }
    localState.min = Number($(this).val());
    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }
    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    $(sliderName).miSlider('destroy');
    return $(sliderName).miSlider(localState);
  });
  $(panelName).on('change', '.slider-panel__max', function maxHandler() {
    const currentValue = Number($(this).val());
    if ((currentValue <= localState.min) || !isNumber(currentValue)) {
      return $(this).val(localState.max);
    }
    localState.max = Number($(this).val());

    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }
    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    $(sliderName).miSlider('destroy');
    return $(sliderName).miSlider(localState);
  });
  $(panelName).on('change', '.slider-panel__range', function rangeHandler() {
    localState.range = this.checked;
    const from = Number(inputFrom.val());
    let to = Number(inputTo.val());
    if (localState.inputFromId && localState.inputToId) {
      if (this.checked) {
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

    $(sliderName).miSlider('destroy');
    $(sliderName).miSlider(localState);
  });
  $(panelName).on('change', '.slider-panel__labelsVisibility', function labelsHandler() {
    localState.labels = this.checked;
    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }
    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    $(sliderName).miSlider('destroy');
    $(sliderName).miSlider(localState);
  });
  $(panelName).on('change', '.slider-panel__vertical', function verticalHandler() {
    localState.vertical = this.checked;
    if (localState.inputFromId) {
      localState.from = Number(inputFrom.val());
    }
    if (localState.inputToId) {
      localState.to = Number(inputTo.val());
    }

    $(sliderName).miSlider('destroy');
    $(sliderName).miSlider(localState);
  });
}

setSliderPanelHandlers('.slider-panel-1', '.slider', localState1);
setSliderPanelHandlers('.slider-panel-2', '.slider-2', localState2);
setSliderPanelHandlers('.slider-panel-3', '.slider-3', localState3);
