export interface ThumbSubViewInterface {
  position: number,
}

export default class ThumbSubView implements ThumbSubViewInterface {
  public position: number;
  public label: object;
  public getValueToPercent: Function;
  private thumb: JQuery = $('<span class="mi-slider__circle"></span>');
  private type: string;
  private shiftX: number;
  private isActive: boolean;

  constructor(type: string, position: number) {

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
    if (this.type === 'right') {
      this.thumb.css('right', `${value}%`);
    } else {
      this.thumb.css('left', `${value}%`);
    }
  }
}