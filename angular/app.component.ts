import { Component, Input } from '@angular/core';
import { DxButton }  from './dx.button';
import { DxRadioGroup }  from './dx.radio.group';
import { DxTemplateHost } from './dx.template.host';

@Component({
  selector: 'app',
  template: `
  <dx-button text="OK" width="300px" type="default" (click)="onClick()"><div *dxTemplate="let data of 'content'">Templated {{data.text}}</div></dx-button>
  <div style="height: 20px"></div>
  <dx-radio-group type="default" [selectedIndex]="1" [items]="['item 1', 'item 2', 'item 3']"></dx-radio-group>
  `,
  providers: [DxTemplateHost],
  directives : [DxButton, DxRadioGroup]
})
export class AppComponent {
  onClick() {
    alert("OK");
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/