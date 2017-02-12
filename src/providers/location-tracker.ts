import { Injectable } from '@angular/core';
import { BackgroundGeolocation } from 'ionic-native';

@Injectable()
export class LocationTracker {
  
  public lat: number = 0;
  public lng: number = 0;
  public hi: number = 1;
 
  constructor() {

  }
 
  startTracking() {
   
    // Background Tracking
   
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10, 
      debug: true,
      startForeground: true,
      interval: 3000 
    };
    
    this.hi = 2;
   
    BackgroundGeolocation.configure((location) => {
      
      this.hi = 3;
   
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      this.lat = location.latitude;
      this.lng = location.longitude;
   
     }, (err) => {
   
      this.hi = 5;
   
    },config);
   
    // Turn ON the background-geolocation system.
    BackgroundGeolocation.start();
   
  }
 
  stopTracking() {
    
    console.log('stopTracking');
    this.hi = 4;
   
    BackgroundGeolocation.stop();
 
  }

}