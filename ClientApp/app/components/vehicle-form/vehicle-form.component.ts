import * as _ from 'underscore';
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/forkJoin';
import { SaveVehicle, Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];  
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastyService: ToastyService) {
      route.params.subscribe(p => {
        this.vehicle.id = +p['id']; //+ converts to the number
      });
    }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if(this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];

      if(this.vehicle.id){
        this.setVehicle(data[2]);
        this.populateModels();
      }
    }, err => {
      if(err.status == 404)
        this.router.navigate(['/home']);
    });
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId; //WE CAN DELETE OBJECT / PROPERTY on JAVASCRIPT
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId); //In real apps, get models as seperate http call
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId: number, $event: any) {
    if($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId); //find object to remove from array
      this.vehicle.features.splice(index, 1); //REMOVES object from the array
    }
  }

  submit() {
    if(this.vehicle.id) {
      this.vehicleService.update(this.vehicle)
        .subscribe(x => {
          this.toastyService.success({
            title: 'Success whatever',
            msg: 'The vehicle was suscessfully update! Yahoo!',
            theme: 'boostrap',
            showClose: true,
            timeout: 5000
          });
        });
    }
    else {
      this.vehicleService.create(this.vehicle)
      .subscribe(
        x => console.log(x)
      );
    }
  }

  delete() {
    if(confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
      .subscribe(x => {
        this.router.navigate(['/home']);
      });
    }
  }
}
