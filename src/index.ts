import './assets/styles/main.scss';

import './slider/miSlider';
import SliderPanel from './slider-panel/SliderPanel';

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

const sliderStates: Array<Props> = [
  {
    min: 500,
    max: 1200,
    from: 500,
    to: 1000,
    isRange: true,
    hasLabels: true,
    isVertical: true,
    inputFromClass: 'js-slider-panel__input_selector_from-1',
    inputToClass: 'js-slider-panel__input_selector_to-1',
  },
  {
    min: 700,
    max: 1200,
    from: 900,
    to: 1000,
    hasLabels: true,
    inputFromClass: 'js-slider-panel__input_selector_from-2',
    inputToClass: 'js-slider-panel__input_selector_to-2',
  },
  {  
    min: 33,
    max: 55,
    step: 1,
    hasLabels: false,
    isRange: false,
    inputFromClass: 'js-slider-panel__input_selector_from-3',
    inputToClass: 'js-slider-panel__input_selector_to-3',
  }
];

const $slider1 = $('.js-slider_id_1');
const $slider2 = $('.js-slider_id_2');
const $slider3 = $('.js-slider_id_3');

$slider1.miSlider(sliderStates[0]);
$slider2.miSlider(sliderStates[1]);
$slider3.miSlider(sliderStates[2]);

const sliderPanel1 = new SliderPanel('.js-slider-panel_id_1', $slider1, sliderStates[0]);
const sliderPanel2 = new SliderPanel('.js-slider-panel_id_2', $slider2, sliderStates[1]);
const sliderPanel3 = new SliderPanel('.js-slider-panel_id_3', $slider3, sliderStates[2]);

sliderPanel1.run();
sliderPanel2.run();
sliderPanel3.run();
