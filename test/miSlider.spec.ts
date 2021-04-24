import Model from '../src/ts/model/model';

describe('Model:', function() {
  
  let states = [
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
      to: 80
    },
    {
      min: 2000,
      max: 5500,
      from: 1000
    }
  ];

  let model: Model;

  for (let state of states) {
    model = new Model({
      min: state.min,
      max: state.max,
      from: state.from,
      to: state.to,
    });

    test('"from" must be a number', function () {
      expect(typeof model.fromValue).toBeDefined();
      expect(typeof model.fromValue).toBe('number');
    });

    test('"to" must be a number', function () {
      expect(typeof model.toValue).toBeDefined();
      expect(typeof model.toValue).toBe('number');
    });

    test(`"from" must be less than "to": ${model.fromValue} < ${model.toValue}`, function () {
      expect(model.fromValue).toBeLessThan(model.toValue);
    })
  }
})