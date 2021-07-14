import Observer from '../pattern/Observer';

interface ILabel {
  render(): JQuery,
  setValue(value: number): void,
  setPosition(value: number): void,
}

type LabelArgs = {
  value: number,
  type: string,
  position: number,
  isVertical?: boolean,
};

export default class Label extends Observer implements ILabel {
  private $label: JQuery = $('<span class="mi-slider__label"></span>');

  private cssSide: 'top' | 'left' | 'bottom' | 'right';

  private value: number;

  private type: string;

  private position: number;

  private isVertical?: boolean;

  constructor({
    value,
    type,
    position,
    isVertical,
  }: LabelArgs) {
    super();

    this.value = value;
    this.type = type;
    this.position = position;
    this.isVertical = isVertical;

    if (this.type === 'fromThumb') {
      this.cssSide = this.isVertical ? 'top' : 'left';
    } else {
      this.cssSide = this.isVertical ? 'bottom' : 'right';
    }
    this.$label.addClass(`mi-slider__label_position_${this.cssSide}`);

    this.setValue(this.value);
    this.setPosition(this.position);

    this.onLabelMousedown();
    this.onLabelMouseup();
  }

  public render(): JQuery {
    return this.$label;
  }

  public setValue(value: number): void {
    this.value = value;
    this.$label.html(`${value}`);
  }

  public setPosition(value: number): void {
    this.position = value;
    this.$label.css(this.cssSide, `${value}%`);
  }

  private handleLabelMousedown(value: JQuery.Event) {
    this.fire({ type: 'ACTIVATE_THUMB', value });
  }

  private handleLabelMouseup() {
    this.fire({ type: 'DISABLE_THUMB' });
  }

  private onLabelMousedown() {
    this.$label.on('mousedown', this.handleLabelMousedown.bind(this));
  }

  private onLabelMouseup(): void {
    $(document).on('mouseup', this.handleLabelMouseup.bind(this));
  }
}
