import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpResponse, HttpHandler } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Time } from '@angular/common';

const bodyScrollClass: string = "loaderBodyScrollFix";
@Injectable({
    providedIn: 'root'
})
export class SpinnerInterceptor implements HttpInterceptor {
    private renderer: Renderer2;
    constructor(private spinner: NgxSpinnerService, private rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    intercept(req: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
        const start = performance.now();
        this.showLoader();
        return next.handle(req).pipe(tap(async (event: HttpEvent < any > ) => {
                if (event instanceof HttpResponse) {
                    this.onEnd();
                }
            },
            (err: any) => {
                this.onEnd();
            }));
    }
    private onEnd(): void {
        this.hideLoader();
    }
    private showLoader(): void {
        this.spinner.show();
    }
    private hideLoader(): void {
        this.spinner.hide();
    }
}