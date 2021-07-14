interface IObserver {
  subscribe(observer: object): void,
  unsubscribe(observer: object): void,
  fire(action: { type: string, value?: number | boolean }): void,
}

export default class Observer implements IObserver {
  private _observers: Array<object>;

  constructor() {
    this._observers = [];
  }

  public subscribe(observer: object): void {
    this._observers.push(observer);
  }

  public unsubscribe(observer: object): void {
    this._observers.filter((obs) => obs !== observer);
  }

  public fire(action: {
    type: string,
    value?: number | boolean | JQuery.Event,
    isOutUpdate?: boolean
  }): void {
    this._observers.forEach((observer: { update: Function }) => observer.update(action));
  }
}
