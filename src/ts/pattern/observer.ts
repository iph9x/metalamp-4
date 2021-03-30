export interface IObserver {
  observers: Array<object>
}

export default class Observer implements IObserver {
  public observers: Array<object>;
  
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer: object) {
    this.observers.push(observer);
  }

  unsubscribe(observer: object) {
    this.observers.filter((obs) => obs !== observer);
  }

  init(action: {type: string, value?: number | boolean}) {
    this.observers.forEach((observer: {update: Function}) => {
      observer.update(action);
    });
  }
}