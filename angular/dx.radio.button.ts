import { Component, Input, EventEmitter, ViewChild, ElementRef, Renderer, OnInit, SimpleChange, OnChanges } from '@angular/core';
//import { VDomRenderer }  from './vdom.renderer';
import { DxComponent }  from './dx.component';
import { DxTemplateHost } from './dx.template.host';

@Component({
  selector: 'dx-radio-button',
  template: ''
})
export class DxRadioButton extends DxComponent implements OnChanges {
  @Input() visible: boolean = true;
  @Input() disabled: boolean = false;
  @Input() type: string = 'normal';
  @Input() onClick?: Function;
  @Input() selectedIndex: Number;
  @Input() items: Array<string>;
  
  //vDomRenderer: VDomRenderer;

  //constructor(public el: ElementRef, public renderer: Renderer) {
  //  this.vDomRenderer = new VDomRenderer(renderer);
  //}
  constructor(el: ElementRef, renderer: Renderer, templateHost: DxTemplateHost) {
    super(el, renderer, templateHost);
  }

  
  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    window.v.createComponent(this.el.nativeElement, window.RadioButton, this, this, this.vDomRenderer);
  }
}