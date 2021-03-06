import { AuthService } from './../../services/auth.service';
import { ProgressService, BrowserXhrWithProgress } from './../../services/progress.service';
import { PhotoService } from './../../services/photo.service';
import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { VehicleService } from '../../services/vehicle.service';
import { ViewChild } from '@angular/core';
import { BrowserXhr } from '@angular/http';

@Component({
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css'],
  providers: [
    { provide: BrowserXhr, useClass: BrowserXhrWithProgress},
    ProgressService
  ]
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef; //fileInput is the name of template variable from the view
  vehicle: any;
  vehicleId: number;
  photos: any[];
  progress: any;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private auth: AuthService,
    private progressService: ProgressService,
    private photoService: PhotoService,
    private vehicleService: VehicleService) {

    route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if(isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicle']);
        return;
      }
    });
  }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if(err.staus == 404) {
            this.router.navigate(['/vehicle']);
            return;
          }        
        });
  }

testAuth() {
  this.auth.login();
}

  delete() {
    if(confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
      .subscribe(x => {
        this.router.navigate(['/vehicles']);
      });
    }
  }

  uploadPhoto() {
    this.progressService.startTracking()
      .subscribe(progress => {
        console.log(progress);
        this.zone.run(() => {
          this.progress = progress;
        });        
      },
      undefined,
      () => { this.progress = null });

    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file;
    if(nativeElement.files)
      file = nativeElement.files[0];

    nativeElement.value = '';    

    if(file)
      this.photoService.upload(this.vehicleId, file)
        .subscribe(photo => {
          this.photos.push(photo);
        },
      err => {
        if (typeof(window) !== 'undefined') {
          this.toasty.error({
              title: 'Error',
              msg: err.text(),
              theme: 'bootstrap',
              showClose: true,
              timeout: 5000
          });
        }
      });
  }
}
