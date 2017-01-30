import { ElementRef, Renderer } from '@angular/core';
import { DxTemplateDirective } from './dx.template';
import { DxTemplateHost } from './dx.template.host';
import { VDomRenderer }  from './vdom.renderer';

export abstract class DxComponent {
  templates: DxTemplateDirective[];
  vDomRenderer: VDomRenderer;

  constructor(public el: ElementRef, public renderer: Renderer, templateHost: DxTemplateHost) {
    this.templates = []
    templateHost.setHost(this);
    this.vDomRenderer = new VDomRenderer(renderer, this.renderTemplate.bind(this));
  }

  renderTemplate(templateName, options) {
    var template = this.templates.filter(function(template) { return template.name === templateName })[0];
    if(template) {
      return template.render({ model: options });
    }
  }

  setTemplate(template: DxTemplateDirective) {
    this.templates.push(template);
  }   
}