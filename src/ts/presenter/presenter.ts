import { ModelInterface } from '../model/model';
import { ViewInterface } from '../view/view';

export default class Presenter {
  constructor(private model: ModelInterface, private view: ViewInterface) {

  }
}