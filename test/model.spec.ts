import Model from '../src/ts/model/model';
import states from './states';

describe('Model:', () => {
  let model: Model;

  states.forEach((state) => {
    model = new Model({
      min: state.min,
      max: state.max,
      from: state.from,
      to: state.to,
    });

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
  });
});
