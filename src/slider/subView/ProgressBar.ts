interface IProgressBar {
  render(): JQuery,
  onProgressBarMousedown(callback: Function): void,
  setFromPosition(position: number): void,
  setToPosition(position: number): void,
}

export default class ProgressBar implements IProgressBar {
  private $progressBar: JQuery = $('<div class="mi-slider__progress-bar"></div>');

  private cssFromSide: 'top' | 'left';

  private cssToSide: 'bottom' |'right';

  constructor(
    private isRange: boolean,
    private isVertical?: boolean,
  ) {
    if (this.isVertical) {
      this.$progressBar.addClass('mi-slider__progress-bar_vertical');
      this.cssFromSide = 'top';
      this.cssToSide = 'bottom';
    } else {
      this.cssFromSide = 'left';
      this.cssToSide = 'right';
    }

    if (!this.isRange) {
      this.setFromPosition(0);
    }
  }

  public render(): JQuery {
    return this.$progressBar;
  }

  public onProgressBarMousedown(callback: Function): void {
    this.$progressBar.on('mousedown', callback.bind(this));
  }

  public setFromPosition(position: number): void {
    this.$progressBar.css(this.cssFromSide, `${position}%`);
  }

  public setToPosition(position: number): void {
    this.$progressBar.css(this.cssToSide, `${position}%`);
  }
}
