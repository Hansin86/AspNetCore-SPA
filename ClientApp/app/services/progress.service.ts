import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
    private uploadProgress: Subject<any>; //same as Observable, but gives us the ability to push there a new value
    downloadProgress: Subject<any> = new Subject();

    startTracking() {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress: any) {
        if(this.uploadProgress)
            this.uploadProgress.next(progress);
    }

    endTracking() {
        if(this.uploadProgress)
            this.uploadProgress.complete();
    }

    constructor() { }
}

@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr {

    constructor(private service: ProgressService) { super();}

    build(): XMLHttpRequest {
        var xhr: XMLHttpRequest = super.build();  //calling build method of the parent class

        //this is for downloading
        xhr.onprogress = (event) => {
            this.service.downloadProgress.next(this.createProgress(event)); //we're pushing object to this observable
        };

        //this is for uploading
        xhr.upload.onprogress = (event) => {
            this.service.notify( //we're pushing object to this observable
                this.createProgress(event)
            );
        };

        //when upload is complete
        xhr.upload.onloadend = () => {
            this.service.endTracking();
        };

       return xhr;
    }

    private createProgress(event: any) {
        return {
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
        };
    }
}