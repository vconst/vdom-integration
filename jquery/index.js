'use strict';
$(function() {

  $.fn.dxButton = function(options) {
    v.createComponent(this[0], window.Button, options);
    return this;
  };

  $.fn.dxRadioButton = function(options) {
    v.createComponent(this[0], window.RadioButton, options);
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

  $("#radio").dxRadioButton({
    items: ["items 1", "item 2", "item 3"],
    selectedIndex: 1,
    type: "default"
  });
});
