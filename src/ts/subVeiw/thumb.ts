export interface IThumb {
  readonly type: string,
  position: number,
}

export default class Thumb implements IThumb {
  public label: object;
  public getValueToPercent: () => number;
  private thumb: JQuery = $('<span class="mi-slider__circle"></span>');
  private shiftX: number;
  private isActive: boolean;

  constructor(public type: string, public position: number) {

    this.type = type;
    this.thumb.addClass(`mi-slider__circle_${type}`);

    this.setPosition(position);
    
    this.render();
  }

  render() {
    return this.thumb;
  }

  public setPosition(value: number) {
    this.position = value;
    this.thumb.css(this.type, `${value}%`);
  }
}