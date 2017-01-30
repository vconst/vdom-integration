import { Component, Input, EventEmitter, ViewChild, ElementRef, Renderer, OnInit, SimpleChange, OnChanges, NgZone } from '@angular/core';
import { DxComponent }  from './dx.component';
import { DxTemplateHost } from './dx.template.host';
import { DxTemplateDirective } from './dx.template';

@Component({
  selector: 'dx-button',
  providers: [DxTemplateHost],
  template: ''
})
export class DxButton extends DxComponent implements OnChanges {
  @Input() visible: boolean = true;
  @Input() disabled: boolean = false;
  @Input() activeStateEnabled: boolean = true;
  @Input() focusStateEnabled: boolean = true;
  @Input() hoverStateEnabled: boolean = true;
  @Input() width: any;
  @Input() height: any;
  @Input() tabIndex?: integer = 0;
  @Input() text: string = 'Angular';
  @Input() type: string = 'normal';
  @Input() onClick?: Function;
  active: boolean = false;
  focused: boolean = false;
  hover: boolean = false;

  constructor(el: ElementRef, renderer: Renderer, templateHost: DxTemplateHost) {
    super(el, renderer, templateHost);
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    window.v.createComponent(this.el.nativeElement, window.Button, this, this, this.vDomRenderer);
    //var nodes = this.templates[0].render({ model: { text: this.text } });
    //this.renderer.projectNodes(this.el.nativeElement, nodes);
  }
}