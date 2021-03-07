import './styles/main.scss';
import './ts/miSlider.ts';

$('.slider').miSlider({
  min: 0,
  max: 1200,
  defaultMin: 700,
  defaultMax: 1000,
  range: true,
  step: 1,
});