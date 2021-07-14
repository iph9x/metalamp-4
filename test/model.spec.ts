import Model from '../src/slider/model/Model';
import states from './states';

describe('Model:', () => {
  let model: Model;

  states.forEach((state) => {
    model = new Model(state);

    test('"from" must be a number', () => {
      expect(typeof model.getFromValue()).toBeDefined();
      expect(typeof model.getFromValue()).toBe('number');
    });

    test('"to" must be a number', () => {
      expect(typeof model.getToValue()).toBeDefined();
      expect(typeof model.getToValue()).toBe('number');
    });

    test('"from" must be less than "to"', () => {
      expect(model.getFromValue()).toBeLessThan(model.getToValue());
    });

    test('step is defined', () => {
      expect(model.getStep()).toBeDefined();
      expect(typeof model.getStep()).toBe('number');
    });
  });

  model = new Model({
    min: 150,
    max: 150,
  });

  test('"from" must be less than "to" if min === max', () => {
    expect(model.getFromValue()).toBeLessThan(model.getToValue());
  });
});
