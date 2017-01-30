import { Component, Input } from '@angular/core';
import { DxButton }  from './dx.button';
import { DxRadioButton }  from './dx.radio.button';
import { DxTemplateHost } from './dx.template.host';

@Component({
  selector: 'app',
  template: `
  <dx-button text="OK" width="300px" type="default" (click)="onClick()"><div *dxTemplate="let data of 'content'">Templated {{data.text}}</div></dx-button>
  <div style="height: 20px"></div>
  <dx-radio-button type="default" [selectedIndex]="1" [items]="['Item 1', 'Item 2', 'Item 3']"></dx-radio-button>
  `,
  providers: [DxTemplateHost],
  directives : [DxButton, DxRadioButton]
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