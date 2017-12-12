import { PhotoService } from './../../services/photo.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { VehicleService } from '../../services/vehicle.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef; //fileInput is the name of template variable from the view
  vehicle: any;
  vehicleId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
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

  delete() {
    if(confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
      .subscribe(x => {
        this.router.navigate(['/vehicles']);
      });
    }
  }

  uploadPhoto() {
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;

    if(nativeElement.files)
      this.photoService.upload(this.vehicleId, nativeElement.files[0])
        .subscribe(x => console.log(x));
  }
}
