import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from "ionic-native";

@Injectable()
export class LocationTracker {
  
  public lat: number = 0;
  public lng: number = 0;
 
  constructor(public zone: NgZone) {

  }
 
  startTracking() {
    console.log("Started Config")
    // Background Tracking
    let config = {
      desiredAccuracy: 10,
      stationaryRadius: 0,
      distanceFilter: 0, 
      startForeground: true,
      stopOnTerminate: true,
      debug: true,
      interval: 500 
    };
   
    BackgroundGeolocation.configure((location) => {
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        console.log("Current Coordinates: " + this.lat + " , " + this.lng);
      })
    }, (err) => {}, config);
   
    // Turn ON the background-geolocation system.
    BackgroundGeolocation.start();
    console.log("Started Tracking");
   
  }
 
  stopTracking() {
    
    console.log('stopTracking');
    this.lat = 0;
    this.lng = 0;
    BackgroundGeolocation.stop();
 
  }

  showSetting(){
    BackgroundGeolocation.showAppSettings();
  }

}