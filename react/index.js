'use strict';

window.onload = function() {
  var EVENTS_MAP = {
    click: "onClick",
    mouseenter: "onMouseEnter",
    mouseleave: "onMouseLeave",
    mousedown: "onMouseDown",
    mouseup: "onMouseUp",
    focusin: "onFocus",
    focusout: "onBlur"
  };

  function convertAttrs(attrs) {
    var result = {};
    for(var name in attrs) {
      if(name === "event") {
        for(var eventName in attrs[name]) {
          if(EVENTS_MAP[eventName]) {
            result[EVENTS_MAP[eventName]] = attrs[name][eventName];
          }
        }
      }
      else if(name === "class") {
        if(typeof attrs["class"] === "string") {
          result.className = attrs["class"];
        }
        else {
          result.className = Object.keys(attrs["class"])
                                  .filter(function(name) { return !!attrs["class"][name]; })
                                  .map(function(name) { return name; })
                                  .join(" ");
        }
      }
      else {
        result[name] = attrs[name];
      }
    }
    return result;
  }

  var reactComponents = {};

  var createReactComponent = function(component) {
    if(!reactComponents[component.name]) {
      reactComponents[component.name] = React.createClass({
        getInitialState: function() {
          return component.getInitialState();
        },
        getDefaultProps: function() {
          return component.getInitialOptions();
        },
        render: function() {
          return component.render(createVDomElement, this.props, this.state, this.setState.bind(this));
        }
      });
    }
    return reactComponents[component.name];
  }

  var createVDomElement = function(tagName, attrs, childNodes) {
    if(tagName && tagName.render) {
      tagName = createReactComponent(tagName);
    }
    else {
      tagName = tagName.substr(1, tagName.length - 2);
      attrs = convertAttrs(attrs);
    }
    if(attrs && attrs.template) {
      childNodes = attrs.template.template(attrs.template.options);
    }
    return React.createElement(tagName, attrs, childNodes);
  };


  var DxButton = createReactComponent(window.Button);
  var DxRadioGroup = createReactComponent(window.RadioGroup);


  ReactDOM.render(React.createElement("div", null,
      React.createElement(
        DxButton,
        {
          text: "OK",
          width: "300px",
          type: "default",
          template: function(options) {
            return "Templated " + options.text;
          },
          onClick: function() {
            alert("OK");
          }
        }
      ), 
      React.createElement(
        "div", 
        { style: { height: 20 } }
      ), 
      React.createElement(
        DxRadioGroup,
        {
          items: ["item 1", "item 2", "item 3"],
          selectedIndex: 1,
          type: "default"
        }
    )
  ), document.getElementById('root'));

};