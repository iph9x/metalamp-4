type States = Array<{
  min: number,
  max: number,
  from?: number,
  to?: number,
  isVertical?: boolean,
  step?: number,
  isRange?: boolean,
  hasLabels?: boolean,
  inputFromClass?: string,
  inputToClass?: string,
}>;

const states: States = [
  {
    min: 100,
    max: 200,
    hasLabels: true,
  },
  {
    min: 100,
    max: -200,
  },
  {
    min: 0,
    max: 500,
    from: 100,
    to: 350,
    inputFromClass: 'inputFrom',
    inputToClass: 'inputTo',
  },
  {
    min: 50,
    max: 125,
    from: 70,
  },
  {
    min: 50,
    max: 125,
    to: 80,
    isVertical: true,
  },
  {
    min: 2000,
    max: 5500,
    from: 1000,
    step: 1,
    isVertical: false,
  },
  {
    min: 100,
    max: 199,
    step: 105,
    isRange: false,
  },
];

export default states;
