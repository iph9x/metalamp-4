import Model from '../src/ts/model/model'
import states from './states';

describe('Model:', function() {
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
});