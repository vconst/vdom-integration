import {
    Directive,
    NgModule,
    TemplateRef,
    ViewContainerRef,
    Input
} from '@angular/core';

import { DxTemplateHost } from './dx.template.host';

export const DX_TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export class RenderData {
    model: any;
    itemIndex: number;
    container: any;
}

@Directive({
    selector: '[dxTemplate][dxTemplateOf]'
})
export class DxTemplateDirective {
    @Input()
    set dxTemplateOf(value) {
        debugger
        this.name = value;
    };
    name: string = "content";

    constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef, private templateHost: DxTemplateHost) {
        debugger
        templateHost.setTemplate(this);
    }

    render(renderData: any) {
        let childView = this.viewContainerRef.createEmbeddedView(this.templateRef, { '$implicit': renderData.model });
        return childView.rootNodes;
        //if (renderData.container) {
        //    renderData.container.append(childView.rootNodes);
        //}
        
        // =========== WORKAROUND =============
        // https://github.com/angular/angular/issues/12243
        //childView['detectChanges']();
        // =========== /WORKAROUND =============
        //return $(childView.rootNodes)
        //    .addClass(DX_TEMPLATE_WRAPPER_CLASS)
        //    .on('dxremove', (e) => {
        //        if (!e._angularIntegration) {
        //            childView.destroy();
        //        }
        //    });
    }
}

@NgModule({
    declarations: [DxTemplateDirective],
    exports: [DxTemplateDirective]
})
export class DxTemplateModule { }