export interface IScale {
  vertical?: boolean
}

export default class Scale implements IScale {
  private scale: JQuery = $(`<div class="mi-slider__scale"></div>`);

  constructor(
    public vertical?: boolean
  ) {
    if (this.vertical) {
      this.scale.addClass(`mi-slider__scale_vertical`);
    }
   
    this.render();
  }

  public render() {
    return this.scale;
  }
}