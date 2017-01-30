'use strict';
$(function() {

  $.fn.dxButton = function(options) {
    v.createComponent(this[0], window.Button, options);
    return this;
  };

  $.fn.dxRadioGroup = function(options) {
    v.createComponent(this[0], window.RadioGroup, options);
    return this;
  };

  $("#button").dxButton({
    text: "OK",
    width: "300px",
    type: "default",
    template: function(options) {
      return "Templated " + options.text;
    },
    onClick: function() {
      alert("OK");
    }
  });

  $("#radio").dxRadioGroup({
    items: ["item 1", "item 2", "item 3"],
    selectedIndex: 1,
    type: "default"
  });
});
