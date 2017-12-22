import { VehicleService } from './../../services/vehicle.service';
import { Vehicle, KeyValuePair } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  private readonly PAGE_SIZE = 3;

  queryResult: any = {};
  //allVehicles: Vehicle[]; if we want to do filtering on client side
  makes: KeyValuePair[];
  //models: KeyValuePair[];
  query: any = {
    pageSize: this.PAGE_SIZE
  };
  columns = [
    { title: 'Id'},
    { title: 'Contact Name', key: 'contactName', isSortable: true},
    { title: 'Make', key: 'make', isSortable: true},
    { title: 'Model', key: 'model', isSortable: true},
    { }
  ];

  constructor(private vehicleService: VehicleService, private auth: AuthService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    //this.vehicleService.getModels()
    //  .subscribe(models => this.models = models);

    //this.vehicleService.getVehicles(this.filter)
    //  //.subscribe(vehicles => this.vehicles = this.allVehicles = vehicles); if we want to do filtering on client side
    //  .subscribe(vehicles => this.vehicles = vehicles);

    this.populateVehicles();      
  }

  onFilterChange() {
    //IF we want to do filtering on client side
    //var vehicles = this.allVehicles; 

    // if(this.filter.makeId) //is truthy
    //   vehicles = vehicles.filter(v => v.make.id == this.filter.makeId);

    // if(this.filter.modelId) //is truthy
    //   vehicles = vehicles.filter(v => v.model.id == this.filter.modelId);

    // this.vehicles = vehicles;
    //ENDIF :)

    //reset page numbe and size (for pagination)
    this.query.page = 1;
    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query)
      .subscribe(result => this.queryResult = result);
  }

  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    this.populateVehicles();
  }

  sortBy(columnName: any) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }

  onPageChange(page: any) {
    this.query.page = page;
    this.populateVehicles();
  }

}
