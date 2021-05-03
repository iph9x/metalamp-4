type States = Array<{
  min: number,
  max: number,
  from?: number,
  to?: number,
  isVertical?: boolean,
  step?: number,
}>
let states: States;
states = [
  {
    min: 100,
    max: 200,
  },
  {
    min: 100,
    max: -200,
  },
  {
    min: 0,
    max: 500,
    from: 100,
    to: 350
  },
  {
    min: 50,
    max: 125,
    from: 70
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
  }
];

export default states;