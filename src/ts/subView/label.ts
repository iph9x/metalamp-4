export interface ILabel {
  render(): JQuery,
  setValue(value: number): void,
  setPosition(value: number): void
}

export default class Label implements ILabel {
  private _label: JQuery = $('<span class="mi-slider__label"></span>');

  private _cssSide: 'top' | 'left' | 'bottom' | 'right';

  constructor(
    private _value: number,
    private _type: string,
    private _position: number,
    private _isVertical?: boolean,
  ) {
    if (this._type === 'minThumb') {
      this._cssSide = this._isVertical ? 'top' : 'left';
    } else {
      this._cssSide = this._isVertical ? 'bottom' : 'right';
    }
    this._label.addClass(`mi-slider__label_${this._cssSide}`);

    this.setValue(this._value);
    this.setPosition(this._position);
  }

  public render(): JQuery {
    return this._label;
  }

  public setValue(value: number): void {
    this._value = value;
    this._label.html(`${value}`);
  }

  public setPosition(value: number): void {
    this._position = value;
    this._label.css(this._cssSide, `${value}%`);
  }
}
