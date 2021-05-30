interface IProgressBar {
  render(): JQuery,
  onProgressBarMousedown(callback: Function): void,
  setFromPosition(position: number): void,
  setToPosition(position: number): void,
}

export default class ProgressBar implements IProgressBar {
  private _$progressBar: JQuery = $('<div class="mi-slider__progress-bar"></div>');

  private _cssFromSide: 'top' | 'left';

  private _cssToSide: 'bottom' |'right';

  constructor(
    private _isRange: boolean,
    private _isVertical?: boolean,
  ) {
    if (this._isVertical) {
      this._$progressBar.addClass('mi-slider__progress-bar_vertical');
      this._cssFromSide = 'top';
      this._cssToSide = 'bottom';
    } else {
      this._cssFromSide = 'left';
      this._cssToSide = 'right';
    }

    if (!this._isRange) {
      this.setFromPosition(0);
    }
  }

  public render(): JQuery {
    return this._$progressBar;
  }

  public onProgressBarMousedown(callback: Function): void {
    this._$progressBar.on('mousedown', (e: JQuery.Event) => callback(e));
  }

  public setFromPosition(position: number): void {
    this._$progressBar.css(this._cssFromSide, `${position}%`);
  }

  public setToPosition(position: number): void {
    this._$progressBar.css(this._cssToSide, `${position}%`);
  }
}
