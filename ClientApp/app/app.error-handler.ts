import * as Raven from 'raven-js';
import { ErrorHandler, Inject, NgZone, isDevMode } from "@angular/core";
import { ToastyService } from "ng2-toasty";

export class AppErrorHandler implements ErrorHandler {
    //we need to run handleError in angular zone; it's because toastyService is async
    constructor(
        @Inject(NgZone) private ngZone: NgZone,
        @Inject(ToastyService) private toastyService: ToastyService) {

    }

    handleError(error: any): void {     
        this.ngZone.run(() => {
            if (typeof(window) !== 'undefined') {
                this.toastyService.error({
                    title: 'Error',
                    msg: 'Ooops! Sth went wrong :(',
                    theme: 'bootstrap',
                    showClose: true,
                    timeout: 5000
                });
            }
        });

        /*if(!isDevMode())
            Raven.captureException(error.originalError || error);
        else
            throw error;*/
    }
    
}