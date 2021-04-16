export interface IObserver {
  subscribe(observer: object): void,
  unsubscribe(observer: object): void,
  init(action: { type: string, value?: number | boolean }): void,
}

export default class Observer implements IObserver {
  private _observers: Array<object>;

  constructor() {
    this._observers = [];
  }

  subscribe(observer: object): void {
    this._observers.push(observer);
  }

  unsubscribe(observer: object): void {
    this._observers.filter((obs) => obs !== observer);
  }

  init(action: { type: string, value?: number | boolean }): void {
    this._observers.forEach((observer: { update: Function }) => observer.update(action));
  }
}
