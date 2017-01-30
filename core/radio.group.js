window.RadioGroup = {
  name: "radio-group",
  getInitialOptions: function() {
    return {
      type: "normal",
      visible: true,
      disabled: false,
      selectedIndex: 0,
      items: []
    };
  },
  getInitialState: function() {
    return {
    };
  },
  render: function(createElement, options, state, setState) {
    var selectedIndex = state.selectedIndex >= 0 ? state.selectedIndex : options.selectedIndex;

    var $element = createElement("<div>", {
        class: {
            "dx-widget": true,
            "dx-radio-group": true,
            "dx-state-invisible": !options.visible,
            "dx-state-disabled": !!options.disabled
        },
        event: {
          click: function(e) {
            options.onClick && options.onClick(e);
          }
        }
      },
      options.items.map(function(item, index) {
          return createElement(window.Button, {
              type: options.type,
              active: index === selectedIndex,
              text: item,
              onClick: function() {
                  setState({ selectedIndex: index });
              }
          });
      })
    );

    return $element;
  }
}