export interface ILabel {
  value: number,
  position: number,
}

export default class Label implements ILabel {
  public value: number;
  public position: number;
  private label: JQuery = $(`<span class="mi-slider__label"></span>`);
  private type: string;
  
  constructor(value: number, type: string, position: number) {

    this.type = type;
    this.label.addClass(`mi-slider__label_${type}`);

    this.setValue(value);
    this.setPosition(position);
    
    this.render();
  }

  render() {
    return this.label;
  }

  public setValue(value: number) {
    this.value = value;
    this.label.html(`${value}`);
  }

  public setPosition(value: number) {
    this.position = value;
    if (this.type === 'right') {
      this.label.css('right', `${value}%`);
    } else {
      this.label.css('left', `${value}%`);
    }
  }

  public show() {
    this.label.css('visibility', 'visible');
  }

  public hide() {
    this.label.css('visibility', 'hidden');
  }  
}