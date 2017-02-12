import { Component } from '@angular/core';

import { Http, Headers } from '@angular/http';

import { NavController } from 'ionic-angular';

import { LocationTracker } from '../../providers/providers';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})

export class Page1 {

  //Http
  header;
  token = "pvgo/1tcTkaIg7Ji90SKpw==";
  skipIndex;

  //UI Inputs
  busInput;
  
  //Bus Info
  bus_services;
  bus_routes;
  
  constructor(public navCtrl: NavController, private http: Http, public locationTracker: LocationTracker) {
    //Setup Http Headers
    this.header = new Headers();
    this.header.append('AccountKey', this.token);
    //this.getBusServicesList();
  }
  
    startTracking(){
      this.locationTracker.startTracking();
    }
   
    stopTracking(){
      this.locationTracker.stopTracking();
    }
    
  
  getBusRoutesList(){
    this.http.get('http://datamall2.mytransport.sg/ltaodataservice/BusRoutes?$skip=' + this.skipIndex*50, {"headers": this.header})
      .map(res => res.json())
      .subscribe(
        data => {
          //if it is first time loading the data
          if (!this.bus_routes || this.bus_routes.length == 0) {
            this.skipIndex = 0;
            this.bus_routes = data.value;
          } else {
            this.bus_routes = this.bus_routes.concat(data.value);
          }
          //if the data is full
          if (data.value.length >= 50) {
            this.skipIndex = this.skipIndex + 1;
            this.getBusRoutesList();
          } else {
            this.skipIndex = 0;
          }
        }
      );
  }
  
  getBusServicesList(){
    this.http.get('http://datamall2.mytransport.sg/ltaodataservice/BusServices?$skip=' + this.skipIndex*50, {"headers": this.header})
      .map(res => res.json())
      .subscribe(
        data => {
          //if it is first time loading the data
          if (!this.bus_services || this.bus_services.length == 0) {
            this.skipIndex = 0;
            this.bus_services = data.value;
          } else {
            this.bus_services = this.bus_services.concat(data.value);
          }
          //if the data is full
          if (data.value.length >= 50) {
            this.skipIndex = this.skipIndex + 1;
            this.getBusServicesList();
          } else {
            this.skipIndex = 0;
          }
        }
      );
  }
  
}