export interface ILabel {
  value: number,
  position: number,
  readonly type: string,
  vertical?: boolean
}

export default class Label implements ILabel {
  private label: JQuery = $(`<span class="mi-slider__label"></span>`);
  private cssType: string;

  constructor(
    public value: number,
    public readonly type: string,
    public position: number,
    public vertical?: boolean
  ) {
    if (this.type === 'minThumb') {
      if (this.vertical) {
        this.cssType = 'top';
      } else {
        this.cssType = 'left';
      }
    } else {
      if (this.vertical) {
        this.cssType = 'bottom';
      } else {
        this.cssType = 'right';
      }
    }
    this.label.addClass(`mi-slider__label_${this.cssType}`);

    this.setValue(value);
    this.setPosition(position);
    
    this.render();
  }


  
  public render() {
    return this.label;
  }



  public setValue(value: number) {
    this.value = value;
    this.label.html(`${value}`);
  }

  public setPosition(value: number) {
    this.position = value;
    this.label.css(this.cssType, `${value}%`);
  }

  public show() {
    this.label.css('visibility', 'visible');
  }

  public hide() {
    this.label.css('visibility', 'hidden');
  }  
}