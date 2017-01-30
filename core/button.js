window.Button = {
  name: "button",
  getInitialOptions: function() {
    return {
      type: "normal",
      visible: true,
      disabled: false,
      tabIndex: "0",
      active: true,
      template: "content"
    };
  },
  defaultTemplates: {
    content: function(options) {
      return options.text;
    }
  },
  getTemplate: function(template) {
    template = this.defaultTemplates[template] || template;
    if(typeof template === "function") {
      return template;
    }
    return function() {};
  },
  getInitialState: function() {
    return {
        //active: false,
        hover: false,
        focused: false
    };
  },
  render: function(createElement, options, state, setState, createTemplate) {
    var that = this;

    createTemplate = createTemplate || function(template, options) {
      return that.getTemplate(template)(options);
    };

    var classes = {
        "dx-widget": true,
        "dx-button": true,
        "dx-button-has-text": true,
        "dx-state-invisible": !options.visible,
        "dx-state-disabled": !!options.disabled,
        "dx-state-active": options.active,
        "dx-state-hover": state.hover,
        "dx-state-focused": state.focused
    };

    classes["dx-button-" + options.type] = true;

    return createElement("<div>", {
        class: classes,
        role: "button",
        "aria-label": options.text,
        tabindex: options.tabIndex,
        style: {
          width: options.width,
          height: options.height
        },
        event: {
          mouseenter: function() {
            setState({ hover: true });
          },
          mouseleave: function() {
            setState({ hover: false });
          },
          /*mousedown: function() {
            setState({ active: true });
          },
          mouseup: function() {
            setState({ active: false });
          },*/
          focusin: function() {
            setState({ focused: true });
          },
          focusout: function() {
            setState({ focused: false });
          },
          click: function(e) {
            options.onClick && options.onClick(e);
          }
        }
      }, 
      createElement("<div>", { class: { "dx-button-content": true } }, 
        createElement("<div>", { class: { "dx-button-text": true }, template: { name: options.template, template: that.getTemplate(options.template), options: { text: options.text } } })
      )
    );
  }
}