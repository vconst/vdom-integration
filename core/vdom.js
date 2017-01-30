(function() {

var jQuery = window.jQuery;

var VDOM_ENABLED = true;

var log = function(text) {
    //console.log(text);
}


var DEFAULT_RENDERER = {
    createElement: function(tagName, text) {
        log("createElement " + tagName);
        if(tagName === "#text") {
            return document.createTextNode(text);
        }
        
        return document.createElement(typeof tagName === "string" ? tagName : "div");
    },
    createTemplate: function(element, options) {
        return options.template && options.template(options.options);
    },
    removeElement: function(element) {
        log("removeElement");
        var parentNode = element && element.parentNode;
        if(parentNode) {
            parentNode.removeChild(element);
        }
    },
    insertElement: function(parentElement, newElement, nextSiblingElement) {
        log("insertElement");
        parentElement.insertBefore(newElement, nextSiblingElement);
    },
    setAttribute: function(element, name, value) {
        log("setAttribute " + name);
        if(value) {
            element.setAttribute(name, value);
        }
        else {
            element.removeAttribute(name);
        }
    },
    setProperty: function(element, name, value) {
        log("setProperty " + name);
        element[name] = value;
    },
    setEvent: function(element, name, value) {
        //log("setEvent " + name);
        element.addEventListener(name, value);
    },
    setText: function(element, text) {
        log("setText " + text);
        element.textContent = text;
    },
    setClass: function(element, className, isAdd) {
        log("setClass " + className + " " + isAdd);
        element.classList.toggle(className, isAdd);
    },
    setStyle: function(element, name, value) {
        log("setStyle " + name + " " + value);
        element.style[name] = value || '';
    }
};

var v = window.v = function(selector, attrs, childNodes, renderer) {

    if(selector instanceof Array) {
        attrs = selector[1];
        childNodes = selector[2];
        selector = selector[0];
    }

    if(attrs instanceof Array || typeof attrs === "string" || attrs instanceof v) {
        childNodes = attrs;
        attrs = undefined;
    }

    if(selector instanceof v) {
        if(attrs || childNodes) {
            selector.init(selector.node, attrs, childNodes);
        }
        return selector;
    }
    else if(jQuery && selector instanceof jQuery) {
        if(selector.length === 1) {
            selector = selector[0];
        }
        else {
            return selector;
        }
    }

    if(selector instanceof Element && selector.v) {
        if(attrs !== undefined || childNodes !== undefined) {
            selector.v.init(selector, attrs, childNodes);
        }
        return selector.v;
    }

    return new v.fn.init(selector, attrs, childNodes, renderer);
};

function parseComplexAttr(value, delimiter, parameterDelimiter) {
    var result = {},
        parameter,
        parameterName,
        parameterValue;

    value = value.split(delimiter);
    for(var i = 0; i < value.length; i++) {
        parameterName = value[i];

        if(parameterDelimiter) {
            parameter = value[i].split(parameterDelimiter);
            parameterName = parameter[0].trim();
            if(parameterName) {
                parameterValue = (parameter[1] || "").trim();
                result[parameterName] = parameterValue;
            }
        }
        else if(parameterName) {
            result[parameterName] = true;
        }
    }
    return result;
}

function compileComplexAttrHook(delimiter, parameterDelimiter, setter) {
    return function(vNode, value, prevValue) {
        var result = value;

        if(typeof value === "string") {
            result = parseComplexAttr(value, delimiter, parameterDelimiter);
        }

        if(result && result !== prevValue) {
            setter(vNode, result, prevValue || {});
            return value;
        }
    };
}

v.attrHooks = {
    "class": compileComplexAttrHook(" ", "",
        function(vNode, value, prevValue) {
            foreach(value, prevValue, function(name) {
                if(value[name] !== prevValue[name]) {
                    if(!vNode.node.classList) {
                        //debugger
                    }
                    vNode.renderer.setClass(vNode.node, name, !!value[name]);
                    //node.classList.toggle(name, !!value[name]);
                }
            });
        }
    ),
    "style": compileComplexAttrHook(";", ":",
        function(vNode, value, prevValue) {
            foreach(value, prevValue, function(name) {
                if(value[name] !== prevValue[name]) {
                    vNode.renderer.setStyle(vNode.node, name, value[name]);
                    //node.style[name] = value[name] || '';
                }
            });
        }
    ),
    "visible": function(vNode, value, prevValue) {
        if(value !== prevValue) {
            vNode.renderer.setStyle(vNode.node, "display", value ? "" : "none");
            //vNode.node.style.display = value ? "" : "none";
        }
        if(!vNode.prevChildNodes && vNode.childNodes && !value) {
            vNode.childNodes = [];
        }
    },
    "html": function(vNode, value, prevValue) {
        if(value !== prevValue) {
            vNode.renderer.setProperty(vNode.node, "innerHTML", value);
            //vNode.node.innerHTML = value;
        }
    },
    "text": function(vNode, value, prevValue) {
        if(value !== prevValue) {
            vNode.renderer.setText(vNode.node, value);
            //vNode.textContent = value;
        }
    },
    "attr": function(vNode, value, prevValue) {
        value = value || {};
        prevValue = prevValue || {};

        foreach(value, prevValue, function(name) {
            if(value[name] !== prevValue[name]) {
                vNode.renderer.setAttribute(vNode.node, name, value[name]);
                
                //if(value[name] === undefined) {
                //    vNode.node.removeAttribute(name);
                //}
                //else {
                //    vNode.node.setAttribute(name, value[name]);
                //}
            }
        });
    },
    "prop": function(vNode, value, prevValue) {
        value = value || {};
        prevValue = prevValue || {};

        foreach(value, prevValue, function(name) {
            if(value[name] !== prevValue[name]) {
                vNode.renderer.setProperty(vNode.node, name, value[name]);
                //vNode.node[name] = value[name];
            }
        });
    },
    "template": function(vNode, value, prevValue) {
        value = value || {};
        prevValue = prevValue || {};
        
        /*var isChanged = value.template !== prevValue.template;

        foreach(value.options || {}, prevValue.options || {}, function(name) {
            if(value[name] !== prevValue[name]) {
                isChanged = true;
            }
        });

        if(isChanged) {*/
        var childNodes = vNode.renderer.createTemplate(vNode.node, value);

        vNode.childNodes = childNodes;
        vNode.normalize();
    },
    "event": function(vNode, value, prevValue) {
        value = value || {};
        prevValue = prevValue || {};

        foreach(value, prevValue, function(name) {
            eventHook(vNode, name, value[name], prevValue[name]);
        });
    },
    "key": function() { }
};

function eventHook(vNode, name, value, prevValue) {
    if(prevValue !== value) {
        if(prevValue) {
            //???
            vNode.node.removeEventListener(name, prevValue);
        }
        if(value) {
            vNode.renderer.setEvent(vNode.node, name, value);

            //vNode.node.addEventListener(eventType, value);
        }
    }
}

/*function isObject(obj) {
    return obj && Object.getPrototypeOf(obj) === Object.prototype;
}*/

function fetch(vNode) {
    var i,
        attributes,
        childNodes;

    vNode.tagName = vNode.node.tagName;

    if(!vNode.attrs) {
        attributes = vNode.node.attributes || [];
        vNode.attrs = {};

        for(i = 0; i < attributes.length; i++) {
            var name = attributes[i].name;
            var value = attributes[i].value;
            if(name === "class") {
                value = parseComplexAttr(value, " ");
            }
            else if(name === "style") {
                value = parseComplexAttr(value, ";", ":");
            }
            vNode.attrs[name] = value;
        }
    }
    if(!vNode.childNodes) {
        vNode.childNodes = [];
        if(!vNode.node.tagName) {
            vNode.textContent = vNode.node.textContent;
        }
        else {
            childNodes = vNode.node.childNodes;
            for(i = 0; i < childNodes.length; i++) {
                vNode.childNodes.push(v(childNodes[i]));
            }
            if(vNode.childNodes.length === 1 && !vNode.childNodes[0].tagName) {
                vNode.textContent = vNode.childNodes[0].textContent;
                vNode.childNodes = [];
            }
        }
    }
}

function foreach(obj1, obj2, func) {
    var name;

    for(name in obj1) {
        func(name);
    }
    if(obj1) {
        for(name in obj2) {
            if(!(name in obj1)) {
                func(name);
            }
        }
    }
}

function applyAttrs(vDom) {
    var attrs = vDom.attrs,
        prevAttrs = vDom.prevAttrs;

    if(attrs !== prevAttrs) {
        foreach(attrs, prevAttrs, function(name) {
            var value = attrs[name];
            var prevValue = prevAttrs && prevAttrs[name];
            if(name.length > 2 && name.indexOf("on") === 0) {
                eventHook(vDom, name.substr(2), value, prevValue);
            }
            else if(v.attrHooks[name]) {
                attrs[name] = v.attrHooks[name](vDom, value, prevValue);
                if(attrs[name] === undefined) {
                    attrs[name] = value;
                }
            }
            else {
                if(value !== prevValue) {
                    vDom.renderer.setAttribute(vDom.node, name, value);
                }
                //if(vDom.node.setAttribute && value !== prevValue) {
                //    vDom.node.setAttribute(name, value);
                //}
            }
        });
    }
    vDom.prevAttrs = vDom.attrs;
}

function getNodeKey(vNode) {
    var key = vNode && vNode.attrs && vNode.attrs.key;
    return (key || key === 0) ? key : vNode && vNode.id;
}

function cleanData(node) {
    if(jQuery) {
        var nodes = [node];
        if(node.getElementsByTagName) {
            nodes = jQuery.merge(nodes, node.getElementsByTagName("*"));
        }
        jQuery.cleanData(nodes);
    }
}

function applyChildren(currentVNode) {
    var prevChildNodes = currentVNode.prevChildNodes || [],
        childNodes = currentVNode.childNodes || [],
        childNodesCount = Math.max(prevChildNodes.length, childNodes.length),
        textContent = currentVNode.textContent,
        prevChildByKey = {},
        childByKey,
        i;

    if(!childNodesCount && currentVNode.prevTextContent !== textContent) {
        currentVNode.renderer.setText(currentVNode.node, textContent)
        //currentVNode.node.textContent = textContent;
        currentVNode.prevTextContent = textContent;
    }

    if(prevChildNodes === childNodes) return;

    //if(childNodesCount && childNodes[0] && getNodeKey(childNodes[0]) !== undefined) {
    var byKey = false;
    childByKey = {};
    for(i = 0; i < childNodes.length; i++) {
        childByKey[getNodeKey(childNodes[i])] = childNodes[i];
    }
    for(i = 0; i < prevChildNodes.length; i++) {
        var key = getNodeKey(prevChildNodes[i]);
        prevChildByKey[key] = prevChildNodes[i];
        if(childByKey[key]) {
            byKey = true;
        }
    }
    //}

    currentVNode.prevChildNodes = currentVNode.childNodes;
    currentVNode.prevChildByKey = currentVNode.childByKey;

    var vNode,
        prevVNode;

    for(i = 0; i < childNodesCount; i++) {
        if(childNodes.length >= prevChildNodes.length) {
            vNode = childNodes[i];
            prevVNode = byKey ? prevChildByKey[getNodeKey(vNode)] : prevChildNodes[i];
        }
        else {
            prevVNode = prevChildNodes[i];
            vNode = byKey ? childByKey[getNodeKey(prevVNode)] : childNodes[i];
        }

        if(!vNode) {
            if(!prevVNode || !prevVNode.node) {
                //debugger;
            }
            else {
                prevVNode.renderer.removeElement(prevVNode.node)
                //prevVNode.node.parentNode.removeChild(prevVNode.node);
                cleanData(prevVNode.node);
            }
        }
        else if(!prevVNode) {
            vNode.build();
            try {
                currentVNode.renderer.insertElement(currentVNode.node, vNode.node, prevChildNodes[i] ? prevChildNodes[i].node : null, prevChildNodes[i - 1] && prevChildNodes[i - 1].node);
                //currentVNode.node.insertBefore(vNode.node, prevChildNodes[i] ? prevChildNodes[i].node : null);
            }
            catch(e) {

            }
        }
        else if(vNode.component ? prevVNode.component !== vNode.component : prevVNode.tagName !== vNode.tagName) {
            vNode.build();
            prevVNode.renderer.removeElement(prevVNode.node);
            currentVNode.renderer.insertElement(currentVNode.node, vNode.node, prevChildNodes[i + 1] ? prevChildNodes[i + 1].node : null, prevChildNodes[i] ? prevChildNodes[i].node : null);
            //prevVNode.node.parentNode.replaceChild(vNode.node, prevVNode.node);
        }
        else {
            if(prevChildNodes[i] !== prevVNode) {
                currentVNode.renderer.insertElement(currentVNode.node, prevVNode.node, prevChildNodes[i + 1] ? prevChildNodes[i + 1].node : null, prevChildNodes[i] ? prevChildNodes[i].node : null);
                //currentVNode.node.insertBefore(prevVNode.node, prevChildNodes[i + 1] ? prevChildNodes[i + 1].node : null);
            }
            childNodes[i] = prevVNode;
            if(prevVNode !== vNode) {
                    prevVNode.init(vNode);
                    //TODO
                    //vNode.id = prevVNode.id;
                    //vNode.prevAttrs = prevVNode.attrs;
                    //vNode.prevChildNodes = prevVNode.childNodes;
                    //vNode.prevChildByKey = prevVNode.childByKey;
                    //vNode.prevTextContent = prevVNode.textContent;
                    //vNode.prevComponent = prevVNode.component;
                    //vNode.node = prevVNode.node;
                    //vNode.parentNode = prevVNode.parentNode;
                    //vNode.node.v = vNode;
             }
             prevVNode.apply();
        }
    }

    if(byKey) {
        for(i = 0; i < prevChildNodes.length; i++) {
            prevVNode = prevChildNodes[i];
            vNode = childByKey[getNodeKey(prevVNode)];

            if(!vNode && prevVNode.node.parentNode) {
                prevVNode.renderer.removeElement(prevVNode.node);
                cleanData(prevVNode.node);
            }
        }
    }
}

var id = 1;

v.fn = v.prototype = {
    init: function(selector, attrs, childNodes, renderer) {
        this.renderer = this.renderer || renderer || DEFAULT_RENDERER;
        this.id = this.id || id++;
        this.prevAttrs = this.attrs;
        this.prevChildNodes = this.childNodes;
        this.prevChildByKey = this.childByKey;
        this.prevTextContent = this.textContent;
        this.prevComponent = this.component;
        this.prevOptions = this.options;

        this.attrs = attrs;
        this.childNodes = childNodes && childNodes instanceof Array ? childNodes.slice(0) : childNodes;

        if(selector instanceof v) {
            if(selector.component) {
                this.options = selector.options;
                this.attrs = this.prevAttrs;
                this.childNodes = this.prevChildNodes;
                this.textContent = this.prevTextContent;
            }
            else {
                this.tagName = selector.tagName;
                this.attrs = selector.attrs;
                this.textContent = selector.textContent;
                this.childNodes = selector.childNodes;
            }
        }
        else if(selector instanceof Element || selector instanceof Text) {
            this.node = selector;
            this.node.v = this;
            this.apply(true);
            //fetch(this);
        }
        else if(typeof selector === "string") {
            if(selector[0] === '<' && selector[selector.length - 1] === '>') {
                this.tagName = selector.slice(1, -1);
            }
            else {
                //debugger;
                this.textContent = selector;
            }
        }
        else if(selector && selector.render) {
            this.component = selector;
            this.options = attrs;
            this.attrs = this.prevAttrs;
            this.childNodes = this.prevChildNodes;
            this.textContent = this.prevTextContent;
        } else {
            return jQuery(selector);
        }
    },
    clone: function(recursive) {
        var result = new v.fn.init(this);

        if(recursive && result.childNodes) {
            result.childNodes = result.childNodes.slice(0);

            for(var i = 0; i < result.childNodes.length; i++) {
                result.childNodes[i] = result.childNodes[i].clone(recursive);
            }
        }

        return result;
    },
    build: function() {
        if(!this.node) {
            if(this.tagName) {
                this.node = this.renderer.createElement(this.tagName);
            }
            else if(this.component) {
                this.node = this.renderer.createElement(this.component);
            } 
            else {
                this.node = this.renderer.createElement("#text", this.textContent);
            }
        }
        this.node.v = this;
        this.apply();
    },
    normalize: function(recursive) {
        var childNodes = this.childNodes;

        if(childNodes) {
            if(!(childNodes instanceof Array)) {
                childNodes = [childNodes];
            }
            if(childNodes[0] && typeof childNodes[0] === "string" && childNodes[0][0] === "<") {
                childNodes = [childNodes];
            }
            if(childNodes.length === 1 && (typeof childNodes[0] === "string")) {
                this.textContent = childNodes[0];
                childNodes = [];
            }
            this.childNodes = childNodes;
            for(var i = 0; i < childNodes.length; i++) {
                childNodes[i] = v(childNodes[i], undefined, undefined, this.renderer);
                if(recursive) {
                    childNodes[i].normalize();
                }
            }
        }
    },
    apply: function(ignoreComponent) {
        this.normalize();

        if(this.component && !ignoreComponent) {
            v.createComponent(this.node, this.component, this.options, undefined, this.renderer);
        }
        else {
            applyAttrs(this);
            applyChildren(this);
        }
    }
};

v.fn.init.prototype = v.fn;

v.createComponent = function(element, Component, options, state, renderer) {
    var initialOptions = Component.getInitialOptions();

    for(var optionName in initialOptions) {
      if(!(optionName in options)) {
        options[optionName] = initialOptions[optionName];
      }
    }

    if(element.renderComponent) {
        element.renderComponent(options);
        return;
    }

    var currentOptions;
    

    state = state || Component.getInitialState();

    var createElement = renderer ? function(tagName, attrs, childNodes) {
      return v(tagName, attrs, childNodes, renderer);
    } : v;

    var setState = function(newState) {
      var isChanged = false;
      for(var name in newState) {
          if(state[name] !== newState[name]) {
            state[name] = newState[name];
            isChanged = true;
          }
      }
      if(isChanged) {
          render(currentOptions);
      }
    };

    var render = function(options) {
      currentOptions = options;
      var $newElement = Component.render(createElement, options, state, setState);

      //v(element).init()
      //selector.init(selector.node, attrs, childNodes);
      createElement(element, $newElement.attrs, $newElement.childNodes);
    };

    render(options);
    
    element.renderComponent = render;

    //return render;
};

})();