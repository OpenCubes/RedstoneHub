(function( $ ){
  //plugin buttonset vertical
  $.fn.buttonsetv = function() {
    return this.each(function(){
      $(this).buttonset();
      $(this).css({'display': 'table', 'margin-bottom': '7px'});
      $('.ui-button', this).css({'margin': '0px', 'display': 'table-cell'}).each(function(index) {
              if (! $(this).parent().is("div.dummy-row")) {
                  $(this).wrap('<div class="dummy-row" style="display:table-row; " />');
              }
          });
      $('.ui-button:first', this).first().removeClass('ui-corner-left').addClass('ui-corner-top');
      $('.ui-button:last', this).last().removeClass('ui-corner-right').addClass('ui-corner-bottom');
    });
  };
})( jQuery );