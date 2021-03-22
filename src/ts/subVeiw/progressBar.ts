export interface IProgressBar {
  minPosition: number,
  maxPosition: number,
  vertical?: boolean
}

export default class ProgressBar implements IProgressBar {
  private progressBar: JQuery = $('<div class="mi-slider__track"></div>');

  constructor(
    public minPosition: number,
    public maxPosition: number,
    public vertical?: boolean
  ) {
    if (this.vertical) {
      this.progressBar.addClass('mi-slider__track_vertical');
    }

    this.setMinPosition(this.minPosition);
    
    this.render();
  }
  
  public render() {
    return this.progressBar;
  }

  public setMinPosition(position: number) {
    if (!this.vertical) {
      this.progressBar.css('left', `${position}%`);
    } else {
      this.progressBar.css('top', `${position}%`);
    }
  }

  public setMaxPosition(position: number) {
    if (!this.vertical) {
      this.progressBar.css('right', `${position}%`);
    } else {
      this.progressBar.css('bottom', `${position}%`);
    }
  }
}