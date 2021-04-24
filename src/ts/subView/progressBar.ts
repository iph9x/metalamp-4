export interface IProgressBar {
  render(): JQuery,
  onClick(callback: Function): void,
  setMinPosition(position: number): void,
  setMaxPosition(position: number): void
}

export default class ProgressBar implements IProgressBar {
  private _progressBar: JQuery = $('<div class="mi-slider__track"></div>');

  constructor(
    private _isRange: boolean,
    private _isVertical?: boolean,
  ) {
    if (this._isVertical) {
      this._progressBar.addClass('mi-slider__track_vertical');
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
    if (this._isVertical) {
      return this._setStyle('top', position);
    }
    return this._setStyle('left', position);
  }

  public setMaxPosition(position: number): void {
    if (this._isVertical) {
      return this._setStyle('bottom', position);
    }
    return this._setStyle('right', position);
  }

  private _setStyle(property: string, value: number) {
    this._progressBar.css(property, `${value}%`);
  }
}
