import View from './view/view';
import Model from './model/model';
import Presenter from './presenter/presenter';

type Props = {
  max: number,
  min: number,
  range?: boolean,
  step?: number,
  from?: number,
  to?: number,
  labels?: boolean,
  vertical?: boolean,
  inputFromId: string,
  inputToId: string,
}

(function ($) {

  let model: Model;
  let view: View;
  let presenter: Presenter;

  let methods = {

    init({
      max,
      min,
      range,
      step,
      from,
      to,
      labels,
      vertical,
      inputFromId,
      inputToId
    }: Props) { 
      return this.each(function() {

        var $this = $(this),
             data = $this.data('miSlider'),
             miSlider = $('<div />', {
               text : $this.attr('title')
             });
         
         if (!data) {
            const modelState = {
              max: to ? to : max,
              min: from ? from : min,
            }
      
            model = new Model(modelState.max, modelState.min);
            view = new View({max, min, slider: $this, isRange: range, step, from, to, labelsVisibility: labels, isVertical: vertical, inputFromId, inputToId});
            presenter = new Presenter(model, view);

           $(this).data('miSlider', {
               target: $this,
               miSlider
           });
         }
      });
    },
    destroy: function() {
      return this.each(function(){
        
        var $this = $(this),
        data = $this.data('miSlider');
        
        view.destroy($this);
        $this.empty()
        view = undefined;
        model = undefined;
        presenter = undefined;

        $(window).unbind('.miSlider');

        data.miSlider.remove();
        $this.removeData('miSlider');
      })

    },
  };

  $.fn.miSlider = function(method: 'init' | 'destroy'): object {    

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } 
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error( `${method} method doesn't exist`);

  };

}(jQuery));

