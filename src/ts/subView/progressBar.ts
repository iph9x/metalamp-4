export interface IProgressBar {
  render(): JQuery,
  onClick(callback: Function): void,
  setMinPosition(position: number): void,
  setMaxPosition(position: number): void
}

export default class ProgressBar implements IProgressBar {
  private _progressBar: JQuery = $('<div class="mi-slider__progress-bar"></div>');

  private _cssFromSide: 'top' | 'left';

  private _cssToSide: 'bottom' |'right';

  constructor(
    private _isRange: boolean,
    private _isVertical?: boolean,
  ) {
    if (this._isVertical) {
      this._progressBar.addClass('mi-slider__progress-bar_vertical');
      this._cssFromSide = 'top';
      this._cssToSide = 'bottom';
    } else {
      this._cssFromSide = 'left';
      this._cssToSide = 'right';
    }
    if (!this._isRange) {
      this.setMinPosition(0);
    }
  }

  public render(): JQuery {
    return this._progressBar;
  }

  public onClick(callback: Function): void {
    this._progressBar.on('mousedown', (e: JQuery.Event) => callback(e));
  }

  public setMinPosition(position: number): void {
    this._progressBar.css(this._cssFromSide, `${position}%`);
  }

  public setMaxPosition(position: number): void {
    this._progressBar.css(this._cssToSide, `${position}%`);
  }
}
