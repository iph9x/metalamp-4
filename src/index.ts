import './styles/main.scss';
import './ts/miSlider.ts';

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
  min: 500,
  max: 1200,
  defaultMin: 600,
  defaultMax: 1000,
  range: true,
  step: 5,
  labels: true,
});