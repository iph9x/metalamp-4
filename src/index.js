import './styles/main.scss';

(function ($) {

  $.fn.slider = function(props) {
    let that = this;

    const isRange = typeof props['range'] === 'boolean' ? props['range'] : false;
    const isSingle = !isRange;

    const min = props['min'] || 0;
    const max = props['max'] || 100;

    let rightBorder = max;
    let rightStartPos = null;
    let rightThumbActive = false;
    let rightOffsetPos = 0;

    let leftThumb = isRange && $('<span class="my-slider__circle my-slider__circle_left"></span>');
    let rightThumb = $('<span class="my-slider__circle my-slider__circle_right"></span>');
    let track  = $('<div class="my-slider__track"></div>');
    let wrapper = $('<div class="my-slider__wrapper"></div>');

        
    this.addClass('my-slider');

    this.append(
      `<div class="my-slider__range-box">
        <span class="my-slider__label my-slider__label_right">${min}</span>
        -
        <span class="my-slider__label my-slider__label_left">${rightBorder}</span>
      </div>`
    );
    
    if (isSingle) {
      track.css('left',  '0%');
    }
    
    rightThumb.css('right', '0%');
    track.css('right', '0%');

    let sliderWidth = this.css('width');

    rightThumb.on('mousedown', (e) => {
      rightThumbActive = true;
      if (rightBorder === max) {
        rightOffsetPos = e.pageX
      }
      rightStartPos = e.pageX;
    });
    
    rightThumb.on('mouseup', () => {
      rightThumbActive = false;
    });

    wrapper.on('mousemove', (e) => {
      if (rightThumbActive === false) return;


      let cursorShift = rightStartPos - e.pageX;
      let newRightPos = rightOffsetPos
        ? cursorShift + (rightOffsetPos - rightStartPos)
        : cursorShift;

      let step = +(newRightPos / Number.parseInt(sliderWidth));
      let stepPercent = step.toFixed(2) * 100;

      rightBorder = max - ((newRightPos / Number.parseInt(sliderWidth)) * rightBorder).toFixed(0);

      rightThumb.css('right', stepPercent + '%');
      track.css('right', stepPercent + '%');

      console.log(rightStartPos, e.pageX, newRightPos, rightBorder);
    })
    
    wrapper
      .append(leftThumb)
      .append(rightThumb)
      .append(track);

    this.append(wrapper);

    return this;

  };

}(jQuery));

$('.slider').slider({
  min: 50,
  max: 100,
  range: false
})