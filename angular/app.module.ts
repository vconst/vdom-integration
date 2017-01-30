import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { DxButton }  from './dx.button';
import { DxRadioButton }  from './dx.radio.button';
import { DxTemplateDirective }  from './dx.template';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, DxButton, DxRadioButton, DxTemplateDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/