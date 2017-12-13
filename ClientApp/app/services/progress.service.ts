import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
    uploadProgress: Subject<any> = new Subject(); //same as Observable, but gives us the ability to push there a new value
    downloadProgress: Subject<any> = new Subject();

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
            this.service.uploadProgress.next( //we're pushing object to this observable
                this.createProgress(event)
            );
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