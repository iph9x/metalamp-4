import Model from '../src/ts/model/model';
import states from './states';

describe('Model:', () => {
  let model: Model;

  states.forEach((state) => {
    model = new Model(state);

    test('"from" must be a number', () => {
      expect(typeof model.fromValue).toBeDefined();
      expect(typeof model.fromValue).toBe('number');
    });

    test('"to" must be a number', () => {
      expect(typeof model.toValue).toBeDefined();
      expect(typeof model.toValue).toBe('number');
    });

    test(`"from" must be less than "to": ${model.fromValue} < ${model.toValue}`, () => {
      expect(model.fromValue).toBeLessThan(model.toValue);
    });

    test('step is defined', () => {
      expect(model.step).toBeDefined();
      expect(typeof model.step).toBe('number');
    });
  });

  model = new Model({
    min: 150,
    max: 150,
  });

  test('"from" must be less than "to" if min === max', () => {
    expect(model.fromValue).toBeLessThan(model.toValue);
  });
});
