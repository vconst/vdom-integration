import { Renderer } from '@angular/core';

export class VDomRenderer {
  constructor(public renderer: Renderer, private renderTemplate: Function) {
  }
  createTemplate(element, options) {
    var childNodes = this.renderTemplate(options.name, options.options);

    if(childNodes) {
      this.renderer.selectRootElement(element, null);
      this.renderer.projectNodes(element, childNodes);
    }
    else {
        return options.template && options.template(options.options);
    }
  }
  createElement(tagName, text) {
    if (tagName === "#text") {
      return this.renderer.createText(null, text, null);
    }
    return this.renderer.createElement(null, tagName && tagName.name || tagName, null);
  }
  removeElement(element) {
    this.renderer.detachView([element]);
  }
  insertElement(parentElement, newElement, nextTargetElement, prevTargetElement) {
    if (nextTargetElement) {
      if (prevTargetElement) {
        this.renderer.attachViewAfter(prevTargetElement, [newElement]);
      }
      else {
        this.renderer.attachViewAfter(nextTargetElement, [newElement]);
        var previousSibling = newElement.previousSibling;
        this.renderer.detachView([nextTargetElement]);
        this.renderer.attachViewAfter(newElement, [nextTargetElement]);
      }
    }
    else {
      this.renderer.projectNodes(parentElement, [newElement]);
    }
  }
  setAttribute(element, name, value) {
    this.renderer.setElementAttribute(element, name, value);
  }
  setProperty(element, name, value) {
    this.renderer.setElementProperty(element, name, value);
  }
  setEvent(element, name, value) {
    this.renderer.listen(element, name, value);
  }
  setText(element, text) {
    this.renderer.selectRootElement(element, null);
    this.renderer.createText(element, text, null);
  }
  setClass(element, className, isAdd) {
    this.renderer.setElementClass(element, className, isAdd);
  }
  setStyle(element, name, value) {
    this.renderer.setElementStyle(element, name, value);
  }
}