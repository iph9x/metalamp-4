export interface ILabel {
  value: number,
  position: number,
  readonly type: string,
}

export default class Label implements ILabel {
  private label: JQuery = $(`<span class="mi-slider__label"></span>`);
  
  constructor(
    public value: number,
    public readonly type: string,
    public position: number
  ) {
    this.label.addClass(`mi-slider__label_${type}`);

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
    this.label.css(this.type, `${value}%`);
  }

  public show() {
    this.label.css('visibility', 'visible');
  }

  public hide() {
    this.label.css('visibility', 'hidden');
  }  
}