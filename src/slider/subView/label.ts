interface ILabel {
  render(): JQuery,
  setValue(value: number): void,
  setPosition(value: number): void,
}

type LabelArgs = {
  value: number,
  type: string,
  position: number,
  isVertical?: boolean,
};

export default class Label implements ILabel {
  private _$label: JQuery = $('<span class="mi-slider__label"></span>');

  private _cssSide: 'top' | 'left' | 'bottom' | 'right';

  private _value: number;

  private _type: string;

  private _position: number;

  private _isVertical?: boolean;

  constructor({
    value,
    type,
    position,
    isVertical,
  }: LabelArgs) {
    this._value = value;
    this._type = type;
    this._position = position;
    this._isVertical = isVertical;

    if (this._type === 'fromThumb') {
      this._cssSide = this._isVertical ? 'top' : 'left';
    } else {
      this._cssSide = this._isVertical ? 'bottom' : 'right';
    }
    this._$label.addClass(`mi-slider__label_position_${this._cssSide}`);

    this.setValue(this._value);
    this.setPosition(this._position);
  }

  public render(): JQuery {
    return this._$label;
  }

  public setValue(value: number): void {
    this._value = value;
    this._$label.html(`${value}`);
  }

  public setPosition(value: number): void {
    this._position = value;
    this._$label.css(this._cssSide, `${value}%`);
  }
}
