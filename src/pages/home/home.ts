import { ViewChild , Component } from '@angular/core';

import { NativeStorage } from 'ionic-native';

import { Http, Headers } from '@angular/http';

import { NavController, Slides } from 'ionic-angular';

import { LocationTracker } from '../../providers/providers';

import { NativeAudio } from 'ionic-native';

import 'rxjs/add/operator/map';

import Rx from 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
   
  @ViewChild(Slides) slides: Slides;

  //UI Text
  ui_title = "Home";
  ui_error;

  //Http
  header;
  token = "pvgo/1tcTkaIg7Ji90SKpw==";
  skipIndex;

  //UI Inputs
  bus_number_input;
  busDirectionInput
  
  //Bus Online Info
  //bus_services;
  bus_routes;
  bus_stops;
  //unique_bus_services;
  load_status = "Not Done";
 
  //Selected Bus & Direction
  selected_bus_route; //All bus stops of the selected bus
  bus_end_stations; //End stations of the selected bus
  bus_end_stations_names; //Names of end stations of selected bus
  bus_all_stop_names; //Names of all bus stops of selected bus and direction
  bus_all_stop_codes; //Codes of all bus stops of selected bus and direction

  //Tracking System
  bus_current_stop; //Current bus stop object
  bus_current_stop_index; //Index of current bus stop object
  bus_next_stop; //Next bus stop object
  bus_destination_stop; //Destination bus stop object
  number_of_stops = 25; //How many stops the user is travelling
  bus_alarm_stop; //Bus stop object where alarm is supposed to ring
  stops_in_advance = 1; //How many stops in advance the user wants a reminder
  back_distance;
  next_distance;
  busbus;

  //Slider
  sliderOptions = {
    pager: false,
    onlyExternal: true
    }

  constructor(public navCtrl: NavController, private http: Http, public locationTracker: LocationTracker) {
    //Setup Http Headers
    this.header = new Headers();
    this.header.append('AccountKey', this.token);
    //this.bus_services = this._bus_services[0].value;
    //this.bus_services = this.bus_services.map((a) => {return a.ServiceNo}).sort();
    //this.bus_services = this.bus_services.filter((a,i) => {return a != this.bus_services[i-1]});
    /* NativeStorage.getItem('bus_services').then((val) => {
       this.bus_services = val;
     });
     */
    NativeStorage.getItem('bus_routes').then((val) => {
       this.bus_routes = val;
     },(err)=>{console.log("error")});
    NativeStorage.getItem('bus_stops').then((val) => {
       this.bus_stops = val;
     },(err)=>{console.log("error")});

     //locationTracker.showSetting();
     this.startTracking();
  }
  
    startTracking(){
      this.locationTracker.startTracking();
      let $nextStop = Rx.Observable.interval(5000).subscribe(
        (a) => {
          if(this.bus_next_stop && this.bus_current_stop && this.slides.isEnd()){
            this.back_distance = this.calculateDistance(this.locationTracker.lat,this.locationTracker.lng, this.bus_current_stop['Latitude'], this.bus_current_stop['Longitude']);
            this.next_distance = this.calculateDistance(this.locationTracker.lat,this.locationTracker.lng, this.bus_next_stop['Latitude'], this.bus_next_stop['Longitude']);
            console.log(this.bus_current_stop['Description'] + ":" + this.back_distance + " " + this.bus_next_stop['Description'] + ": " + this.next_distance);
            if (this.back_distance >= this.next_distance) {
              this.bus_current_stop_index += 1;
              this.bus_current_stop = this.bus_next_stop;
              this.bus_next_stop = this.bus_stops.find((a) => {return (a['Description'] == this.bus_all_stop_names[this.bus_current_stop_index])});
            }
            if(this.bus_current_stop == this.bus_alarm_stop){
              NativeAudio.preloadSimple('alarmsound', 'assets/audio/alarm.mp3').then(()=>{
                NativeAudio.play('alarmsound', () => console.log('Alarm is done playing'));
                this.load_status = "Arrived";
              });
              $nextStop.unsubscribe();
            }
          }
        }
      );
    }
   
    stopTracking(){
      this.locationTracker.stopTracking();
    }

/*Bus Routes
  [{
    ServiceNo: "...",
    Directions: [
      [{StopSequence: ..., BusStopCode: ...}, ...]
      [{StopSequence: ..., BusStopCode: ...}, ...]
    ]
  }]
  */

/*Bus Stops=
    [{  
      "BusStopCode":"01012",
      "RoadName":"Victoria St",
      "Description":"Hotel Grand Pacific",
      "Latitude":1.29684825487647,
      "Longitude":103.85253591654006
    }, ...]
*/
  //Bus Data 
    /*Example Bus Routes Data:
        [  
          {  
            "ServiceNo":"-S49",
            "Operator":"SMRT",
            "Direction":1,
            "StopSequence":1,
            "BusStopCode":"14141",
            "Distance":0,
            "WD_FirstBus":"0612",
            "WD_LastBus":"2345",
            "SAT_FirstBus":"0612",
            "SAT_LastBus":"2345",
            "SUN_FirstBus":"0612",
            "SUN_LastBus":"2345"
          },
          {  
            "ServiceNo":"-S49",
            "Operator":"SMRT",
            "Direction":1,
            "StopSequence":2,
            "BusStopCode":"14121",
            "Distance":2,
            "WD_FirstBus":"0600",
            "WD_LastBus":"2330",
            "SAT_FirstBus":"0600",
            "SAT_LastBus":"2330",
            "SUN_FirstBus":"0600",
            "SUN_LastBus":"2330"
          },
          {  
            "ServiceNo":"-S49",
            "Operator":"SMRT",
            "Direction":1,
            "StopSequence":3,
            "BusStopCode":"14139",
            "Distance":2.3,
            "WD_FirstBus":"0606",
            "WD_LastBus":"2335",
            "SAT_FirstBus":"0606",
            "SAT_LastBus":"2335",
            "SUN_FirstBus":"0606",
            "SUN_LastBus":"2335"
          },
          {  
            "ServiceNo":"-S49",
            "Operator":"SMRT",
            "Direction":1,
            "StopSequence":4,
            "BusStopCode":"14519",
            "Distance":4,
            "WD_FirstBus":"0618",
            "WD_LastBus":"2344",
            "SAT_FirstBus":"0618",
            "SAT_LastBus":"2344",
            "SUN_FirstBus":"0618",
            "SUN_LastBus":"2344"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":1,
            "BusStopCode":"75009",
            "Distance":0,
            "WD_FirstBus":"0500",
            "WD_LastBus":"2300",
            "SAT_FirstBus":"0500",
            "SAT_LastBus":"2300",
            "SUN_FirstBus":"0500",
            "SUN_LastBus":"2300"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":2,
            "BusStopCode":"76059",
            "Distance":0.6,
            "WD_FirstBus":"0502",
            "WD_LastBus":"2302",
            "SAT_FirstBus":"0502",
            "SAT_LastBus":"2302",
            "SUN_FirstBus":"0502",
            "SUN_LastBus":"2302"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":3,
            "BusStopCode":"76069",
            "Distance":1.1,
            "WD_FirstBus":"0504",
            "WD_LastBus":"2304",
            "SAT_FirstBus":"0504",
            "SAT_LastBus":"2304",
            "SUN_FirstBus":"0503",
            "SUN_LastBus":"2303"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":4,
            "BusStopCode":"96289",
            "Distance":2.3,
            "WD_FirstBus":"0508",
            "WD_LastBus":"2308",
            "SAT_FirstBus":"0508",
            "SAT_LastBus":"2308",
            "SUN_FirstBus":"0507",
            "SUN_LastBus":"2307"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":5,
            "BusStopCode":"96109",
            "Distance":2.7,
            "WD_FirstBus":"0509",
            "WD_LastBus":"2310",
            "SAT_FirstBus":"0509",
            "SAT_LastBus":"2310",
            "SUN_FirstBus":"0509",
            "SUN_LastBus":"2309"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":6,
            "BusStopCode":"85079",
            "Distance":3.3,
            "WD_FirstBus":"0511",
            "WD_LastBus":"2312",
            "SAT_FirstBus":"0511",
            "SAT_LastBus":"2312",
            "SUN_FirstBus":"0511",
            "SUN_LastBus":"2311"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":7,
            "BusStopCode":"85089",
            "Distance":3.5,
            "WD_FirstBus":"0512",
            "WD_LastBus":"2312",
            "SAT_FirstBus":"0512",
            "SAT_LastBus":"2312",
            "SUN_FirstBus":"0511",
            "SUN_LastBus":"2311"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":8,
            "BusStopCode":"85069",
            "Distance":3.8,
            "WD_FirstBus":"0513",
            "WD_LastBus":"2314",
            "SAT_FirstBus":"0513",
            "SAT_LastBus":"2314",
            "SUN_FirstBus":"0512",
            "SUN_LastBus":"2312"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":9,
            "BusStopCode":"85059",
            "Distance":4.1,
            "WD_FirstBus":"0514",
            "WD_LastBus":"2315",
            "SAT_FirstBus":"0514",
            "SAT_LastBus":"2315",
            "SUN_FirstBus":"0513",
            "SUN_LastBus":"2313"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":10,
            "BusStopCode":"85049",
            "Distance":4.5,
            "WD_FirstBus":"0515",
            "WD_LastBus":"2316",
            "SAT_FirstBus":"0515",
            "SAT_LastBus":"2316",
            "SUN_FirstBus":"0515",
            "SUN_LastBus":"2315"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":11,
            "BusStopCode":"85039",
            "Distance":4.8,
            "WD_FirstBus":"0517",
            "WD_LastBus":"2317",
            "SAT_FirstBus":"0517",
            "SAT_LastBus":"2317",
            "SUN_FirstBus":"0516",
            "SUN_LastBus":"2316"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":12,
            "BusStopCode":"85029",
            "Distance":5,
            "WD_FirstBus":"0517",
            "WD_LastBus":"2318",
            "SAT_FirstBus":"0517",
            "SAT_LastBus":"2318",
            "SUN_FirstBus":"0516",
            "SUN_LastBus":"2316"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":13,
            "BusStopCode":"85019",
            "Distance":5.2,
            "WD_FirstBus":"0518",
            "WD_LastBus":"2319",
            "SAT_FirstBus":"0518",
            "SAT_LastBus":"2319",
            "SUN_FirstBus":"0517",
            "SUN_LastBus":"2317"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":14,
            "BusStopCode":"94079",
            "Distance":5.4,
            "WD_FirstBus":"0519",
            "WD_LastBus":"2320",
            "SAT_FirstBus":"0519",
            "SAT_LastBus":"2320",
            "SUN_FirstBus":"0518",
            "SUN_LastBus":"2318"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":15,
            "BusStopCode":"94069",
            "Distance":5.9,
            "WD_FirstBus":"0520",
            "WD_LastBus":"2321",
            "SAT_FirstBus":"0520",
            "SAT_LastBus":"2321",
            "SUN_FirstBus":"0519",
            "SUN_LastBus":"2319"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":16,
            "BusStopCode":"94059",
            "Distance":6.3,
            "WD_FirstBus":"0521",
            "WD_LastBus":"2322",
            "SAT_FirstBus":"0521",
            "SAT_LastBus":"2322",
            "SUN_FirstBus":"0520",
            "SUN_LastBus":"2321"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":17,
            "BusStopCode":"94049",
            "Distance":6.7,
            "WD_FirstBus":"0522",
            "WD_LastBus":"2323",
            "SAT_FirstBus":"0522",
            "SAT_LastBus":"2323",
            "SUN_FirstBus":"0521",
            "SUN_LastBus":"2322"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":18,
            "BusStopCode":"94089",
            "Distance":6.9,
            "WD_FirstBus":"0523",
            "WD_LastBus":"2323",
            "SAT_FirstBus":"0523",
            "SAT_LastBus":"2324",
            "SUN_FirstBus":"0522",
            "SUN_LastBus":"2322"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":19,
            "BusStopCode":"94039",
            "Distance":7.2,
            "WD_FirstBus":"0523",
            "WD_LastBus":"2324",
            "SAT_FirstBus":"0523",
            "SAT_LastBus":"2324",
            "SUN_FirstBus":"0522",
            "SUN_LastBus":"2323"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":20,
            "BusStopCode":"94029",
            "Distance":7.6,
            "WD_FirstBus":"0524",
            "WD_LastBus":"2325",
            "SAT_FirstBus":"0524",
            "SAT_LastBus":"2325",
            "SUN_FirstBus":"0523",
            "SUN_LastBus":"2324"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":21,
            "BusStopCode":"94019",
            "Distance":7.8,
            "WD_FirstBus":"0525",
            "WD_LastBus":"2325",
            "SAT_FirstBus":"0525",
            "SAT_LastBus":"2326",
            "SUN_FirstBus":"0524",
            "SUN_LastBus":"2325"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":22,
            "BusStopCode":"93099",
            "Distance":8.2,
            "WD_FirstBus":"0526",
            "WD_LastBus":"2326",
            "SAT_FirstBus":"0526",
            "SAT_LastBus":"2327",
            "SUN_FirstBus":"0525",
            "SUN_LastBus":"2326"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":23,
            "BusStopCode":"93089",
            "Distance":8.7,
            "WD_FirstBus":"0527",
            "WD_LastBus":"2327",
            "SAT_FirstBus":"0527",
            "SAT_LastBus":"2328",
            "SUN_FirstBus":"0526",
            "SUN_LastBus":"2328"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":24,
            "BusStopCode":"93079",
            "Distance":9,
            "WD_FirstBus":"0528",
            "WD_LastBus":"2328",
            "SAT_FirstBus":"0528",
            "SAT_LastBus":"2329",
            "SUN_FirstBus":"0527",
            "SUN_LastBus":"2329"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":25,
            "BusStopCode":"93069",
            "Distance":9.3,
            "WD_FirstBus":"0529",
            "WD_LastBus":"2329",
            "SAT_FirstBus":"0529",
            "SAT_LastBus":"2330",
            "SUN_FirstBus":"0528",
            "SUN_LastBus":"2330"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":26,
            "BusStopCode":"93059",
            "Distance":9.7,
            "WD_FirstBus":"0530",
            "WD_LastBus":"2330",
            "SAT_FirstBus":"0530",
            "SAT_LastBus":"2331",
            "SUN_FirstBus":"0529",
            "SUN_LastBus":"2331"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":27,
            "BusStopCode":"92159",
            "Distance":10,
            "WD_FirstBus":"0531",
            "WD_LastBus":"2331",
            "SAT_FirstBus":"0531",
            "SAT_LastBus":"2332",
            "SUN_FirstBus":"0530",
            "SUN_LastBus":"2332"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":28,
            "BusStopCode":"92149",
            "Distance":10.3,
            "WD_FirstBus":"0532",
            "WD_LastBus":"2332",
            "SAT_FirstBus":"0532",
            "SAT_LastBus":"2333",
            "SUN_FirstBus":"0531",
            "SUN_LastBus":"2333"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":29,
            "BusStopCode":"92139",
            "Distance":10.6,
            "WD_FirstBus":"0533",
            "WD_LastBus":"2333",
            "SAT_FirstBus":"0533",
            "SAT_LastBus":"2334",
            "SUN_FirstBus":"0532",
            "SUN_LastBus":"2334"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":30,
            "BusStopCode":"92129",
            "Distance":11.1,
            "WD_FirstBus":"0534",
            "WD_LastBus":"2334",
            "SAT_FirstBus":"0534",
            "SAT_LastBus":"2336",
            "SUN_FirstBus":"0533",
            "SUN_LastBus":"2335"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":31,
            "BusStopCode":"92119",
            "Distance":11.6,
            "WD_FirstBus":"0536",
            "WD_LastBus":"2335",
            "SAT_FirstBus":"0535",
            "SAT_LastBus":"2337",
            "SUN_FirstBus":"0534",
            "SUN_LastBus":"2337"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":32,
            "BusStopCode":"92109",
            "Distance":11.8,
            "WD_FirstBus":"0536",
            "WD_LastBus":"2336",
            "SAT_FirstBus":"0536",
            "SAT_LastBus":"2338",
            "SUN_FirstBus":"0535",
            "SUN_LastBus":"2337"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":33,
            "BusStopCode":"92099",
            "Distance":12.1,
            "WD_FirstBus":"0537",
            "WD_LastBus":"2337",
            "SAT_FirstBus":"0537",
            "SAT_LastBus":"2339",
            "SUN_FirstBus":"0535",
            "SUN_LastBus":"2338"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":34,
            "BusStopCode":"92161",
            "Distance":12.6,
            "WD_FirstBus":"0539",
            "WD_LastBus":"2338",
            "SAT_FirstBus":"0538",
            "SAT_LastBus":"2340",
            "SUN_FirstBus":"0537",
            "SUN_LastBus":"2340"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":35,
            "BusStopCode":"82071",
            "Distance":13,
            "WD_FirstBus":"0540",
            "WD_LastBus":"2339",
            "SAT_FirstBus":"0539",
            "SAT_LastBus":"2342",
            "SUN_FirstBus":"0538",
            "SUN_LastBus":"2341"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":36,
            "BusStopCode":"81199",
            "Distance":13.8,
            "WD_FirstBus":"0542",
            "WD_LastBus":"2341",
            "SAT_FirstBus":"0541",
            "SAT_LastBus":"2344",
            "SUN_FirstBus":"0540",
            "SUN_LastBus":"2343"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":37,
            "BusStopCode":"81189",
            "Distance":14.1,
            "WD_FirstBus":"0543",
            "WD_LastBus":"2342",
            "SAT_FirstBus":"0542",
            "SAT_LastBus":"2345",
            "SUN_FirstBus":"0540",
            "SUN_LastBus":"2344"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":38,
            "BusStopCode":"81179",
            "Distance":14.6,
            "WD_FirstBus":"0544",
            "WD_LastBus":"2343",
            "SAT_FirstBus":"0543",
            "SAT_LastBus":"2346",
            "SUN_FirstBus":"0541",
            "SUN_LastBus":"2345"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":39,
            "BusStopCode":"80141",
            "Distance":15.2,
            "WD_FirstBus":"0546",
            "WD_LastBus":"2345",
            "SAT_FirstBus":"0545",
            "SAT_LastBus":"2348",
            "SUN_FirstBus":"0543",
            "SUN_LastBus":"2347"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":40,
            "BusStopCode":"80219",
            "Distance":15.9,
            "WD_FirstBus":"0547",
            "WD_LastBus":"2346",
            "SAT_FirstBus":"0546",
            "SAT_LastBus":"2350",
            "SUN_FirstBus":"0545",
            "SUN_LastBus":"2348"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":41,
            "BusStopCode":"80169",
            "Distance":17.3,
            "WD_FirstBus":"0550",
            "WD_LastBus":"2349",
            "SAT_FirstBus":"0549",
            "SAT_LastBus":"2353",
            "SUN_FirstBus":"0548",
            "SUN_LastBus":"2351"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":42,
            "BusStopCode":"80159",
            "Distance":18,
            "WD_FirstBus":"0552",
            "WD_LastBus":"2351",
            "SAT_FirstBus":"0551",
            "SAT_LastBus":"2355",
            "SUN_FirstBus":"0550",
            "SUN_LastBus":"2353"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":43,
            "BusStopCode":"02119",
            "Distance":18.5,
            "WD_FirstBus":"0553",
            "WD_LastBus":"2352",
            "SAT_FirstBus":"0552",
            "SAT_LastBus":"2356",
            "SUN_FirstBus":"0551",
            "SUN_LastBus":"2354"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":44,
            "BusStopCode":"03019",
            "Distance":19.5,
            "WD_FirstBus":"0556",
            "WD_LastBus":"2355",
            "SAT_FirstBus":"0554",
            "SAT_LastBus":"2359",
            "SUN_FirstBus":"0553",
            "SUN_LastBus":"2356"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":45,
            "BusStopCode":"03059",
            "Distance":19.8,
            "WD_FirstBus":"0557",
            "WD_LastBus":"2356",
            "SAT_FirstBus":"0555",
            "SAT_LastBus":"2359",
            "SUN_FirstBus":"0554",
            "SUN_LastBus":"2357"
          },
          {  
            "ServiceNo":"10",
            "Operator":"SBST",
            "Direction":1,
            "StopSequence":46,
            "BusStopCode":"03129",
            "Distance":20.2,
            "WD_FirstBus":"0558",
            "WD_LastBus":"2357",
            "SAT_FirstBus":"0556",
            "SAT_LastBus":"2400",
            "SUN_FirstBus":"0555",
            "SUN_LastBus":"2358"
          }
        ]
    */

    getBusRoutesList(i){
      let skipIndex = i;
      this.http.get('http://datamall2.mytransport.sg/ltaodataservice/BusRoutes?$skip=' + skipIndex*50, {"headers": this.header})
        .map(res => res.json())
        .subscribe(
          data => {
            //if it is first time loading the data
            if (!this.bus_routes || this.bus_routes.length == 0) {
              skipIndex = 0;
              this.bus_routes = data.value;
            } else {
              this.bus_routes = this.bus_routes.concat(data.value);
            }
            //if the data is full
            if (data.value.length >= 50) {
              skipIndex = skipIndex + 1;
              this.getBusRoutesList(skipIndex);
            } else {
              skipIndex = 0;
              let bus_data = [];
              this.bus_routes.forEach((bus)=>{
                let matching_service = bus_data.find((service)=>{
                  return service.ServiceNo == bus.ServiceNo;
                });
                let direction = bus.Direction - 1
                if(matching_service === undefined){
                  matching_service = {ServiceNo: bus.ServiceNo, Directions: []};
                  bus_data.push({ServiceNo: bus.ServiceNo, Directions: []});
                }
                if(matching_service.Directions[direction] === undefined){
                  matching_service.Directions[direction] = [{StopSequence: bus.StopSequence, BusStopCode: bus.BusStopCode}];
                } else {
                  matching_service.Directions[direction].push({StopSequence: bus.StopSequence, BusStopCode: bus.BusStopCode})
                }
              });
              this.bus_routes = bus_data;
              bus_data.forEach((service)=>{
                console.log(service.Directions)
              })
              NativeStorage.setItem('bus_routes', this.bus_routes);
              console.log("Bus Routes Loaded");
              this.load_status = "DoneDone";
            }
          }
        );
    }

    updateBusRoutesList(){
      this.bus_routes = [];
      this.getBusRoutesList(0);
    }

    /*Example Bus Services Data:
      [  
        {  
          "ServiceNo":"118",
          "Operator":"GAS",
          "Direction":1,
          "Category":"TRUNK",
          "OriginCode":"65009",
          "DestinationCode":"97009",
          "AM_Peak_Freq":"10-12",
          "AM_Offpeak_Freq":"10-12",
          "PM_Peak_Freq":"10-12",
          "PM_Offpeak_Freq":"15-10",
          "LoopDesc":""
        },
        {  
          "ServiceNo":"118",
          "Operator":"GAS",
          "Direction":2,
          "Category":"TRUNK",
          "OriginCode":"97009",
          "DestinationCode":"65009",
          "AM_Peak_Freq":"10-12",
          "AM_Offpeak_Freq":"10-12",
          "PM_Peak_Freq":"10-12",
          "PM_Offpeak_Freq":"10-10",
          "LoopDesc":""
        },
        {  
          "ServiceNo":"119",
          "Operator":"GAS",
          "Direction":1,
          "Category":"TRUNK",
          "OriginCode":"65009",
          "DestinationCode":"65009",
          "AM_Peak_Freq":"16-08",
          "AM_Offpeak_Freq":"18-12",
          "PM_Peak_Freq":"17-12",
          "PM_Offpeak_Freq":"15-17",
          "LoopDesc":"Hougang St 21"
        }
      ]
    */

    /*
    getBusServicesList(i){
      let skipIndex = i;
      this.http.get('http://datamall2.mytransport.sg/ltaodataservice/BusServices?$skip=' + skipIndex*50, {"headers": this.header})
        .map(res => res.json())
        .subscribe(
          data => {
            //if it is first time loading the data
            if (!this.bus_services || this.bus_services.length == 0) {
              skipIndex = 0;
              this.bus_services = data.value;
            } else {
              this.bus_services = this.bus_services.concat(data.value);
            }
            //if the data is full
            if (data.value.length >= 50) {
              skipIndex = skipIndex + 1;
              this.getBusServicesList(skipIndex);
            } else {
              skipIndex = 0;
              this.unique_bus_services = this.unique_bus_services.map((a) => {return a.ServiceNo}).sort();
              this.unique_bus_services = this.unique_bus_services.filter((a,i,arr) => {return a != arr[i-1]});
              NativeStorage.setItem('bus_services', this.bus_services);
              NativeStorage.setItem('unique_bus_services', this.unique_bus_services);
              console.log("Bus Services Loaded");
            }
          }
        );
    }

    updateBusServicesList(){
      this.bus_services = [];
      this.unique_bus_services = [];
      this.getBusServicesList(0);
    }

    Example Bus Stops Data:
      [
        {  
          "BusStopCode":"01012",
          "RoadName":"Victoria St",
          "Description":"Hotel Grand Pacific",
          "Latitude":1.29684825487647,
          "Longitude":103.85253591654006
        },
        {  
          "BusStopCode":"01013",
          "RoadName":"Victoria St",
          "Description":"St. Joseph's Ch",
          "Latitude":1.29770970610083,
          "Longitude":103.8532247463225
        },
        {  
          "BusStopCode":"01019",
          "RoadName":"Victoria St",
          "Description":"Bras Basah Cplx",
          "Latitude":1.29698951191332,
          "Longitude":103.85302201172507
        },
        {  
          "BusStopCode":"01029",
          "RoadName":"Nth Bridge Rd",
          "Description":"Cosmic Insurance Bldg",
          "Latitude":1.2966729849642,
          "Longitude":103.85441422464267
        }
      ]
    */


    getBusStopsList(i){
      let skipIndex = i;
      this.http.get('http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=' + skipIndex*50, {"headers": this.header})
        .map(res => res.json())
        .subscribe(
          data => {
            //if it is first time loading the data
            if (!this.bus_stops || this.bus_stops.length == 0) {
              skipIndex = 0;
              this.bus_stops = data.value;
            } else {
              this.bus_stops = this.bus_stops.concat(data.value);
            }
            //if the data is full
            if (data.value.length >= 50) {
              skipIndex = skipIndex + 1;
              this.getBusStopsList(skipIndex);
            } else {
              skipIndex = 0;
              NativeStorage.setItem('bus_stops', this.bus_stops);
              console.log("Bus Stops Loaded");
              this.load_status = "Done";
            }
          }
        );
    }

    updateBusStopsList(){
      this.bus_stops = [];
      this.getBusStopsList(0);
    }

    updateBusInfo() {
      this.load_status = "Loading"
      this.updateBusStopsList();
      this.updateBusRoutesList();
    }  


  submitBusNo(input_bus_number){
    if(input_bus_number) {
      this.bus_number_input = "";
      this.selected_bus_route = this.bus_routes.filter((a) => {return (a.ServiceNo  == input_bus_number)})[0];
      //console.log("User selected Bus " + JSON.stringify(this.selected_bus_route.ServiceNo));
      this.bus_end_stations = this.selected_bus_route["Directions"].map((direction) => {return direction[direction.length - 1]});
      //console.log("End Station Codes " + JSON.stringify(this.bus_end_stations));
      this.bus_end_stations_names = this.bus_end_stations.map((a) => {
        return this.bus_stops.find((b) =>  {return (b['BusStopCode'] == a['BusStopCode'])})
      }).map((a) => {
        if(a){
          return {BusStopCode: a['BusStopCode'], Description: a['Description']};
        } else {
          return {BusStopCode: null, Description: null};
        }
      });
    } else {
      this.selected_bus_route = [];
      this.bus_end_stations = [];
      this.bus_end_stations_names = [];
      this.bus_all_stop_names = [];
      console.log("NO BUS NUMBER INPUT!");
    }
    //console.log(JSON.stringify(this.bus_end_stations_names[0]));
    this.slides.slideTo(1, 500);
  }

  submitBusDirection(index){
    this.bus_all_stop_codes = this.selected_bus_route.Directions[index];
    this.bus_all_stop_names = this.bus_all_stop_codes.map((bus_route_input) => {
      return bus_route_input["BusStopCode"]
    }).map((bus_stop_code_input) => {
      return this.bus_stops.find((b) => {return (b["BusStopCode"] == bus_stop_code_input)})
    }).map((bus_stop_input) => {
      if(bus_stop_input){
        return bus_stop_input["Description"];
      } else {
        return null;
      }
    });
    console.log(this.bus_all_stop_names);
    this.slides.slideTo(2, 500);
  }

  submitBusStop(index){
    if(!this.bus_current_stop) {
      this.bus_current_stop_index = index;
      this.bus_current_stop = this.bus_stops.find((a) => {return (a['Description'] == this.bus_all_stop_names[index])});
      this.bus_next_stop = this.bus_stops.find((a) => {return (a['Description'] == this.bus_all_stop_names[index+1])});
      console.log(this.bus_current_stop);
    } else if (!this.bus_destination_stop) {
      this.bus_destination_stop = this.bus_stops.find((a) => {return (a['Description'] == this.bus_all_stop_names[index])});
      console.log(this.bus_destination_stop);
      this.number_of_stops = this.bus_all_stop_names.indexOf(this.bus_destination_stop['Description']) - this.bus_all_stop_names.indexOf(this.bus_current_stop['Description']);
      this.slides.slideTo(3, 500);
    } 
  }

  submitStopsInAdvance(){
    let index;
    this.slides.slideNext(500);
    index = this.bus_all_stop_names.indexOf(this.bus_destination_stop['Description']) - this.stops_in_advance;
    this.bus_alarm_stop = this.bus_stops.find((a) => {return (a['Description'] == this.bus_all_stop_names[index])});
    console.log(this.bus_alarm_stop);
  }

  slideBack(){
    if(!this.slides.isBeginning()){
      this.slides.slidePrev(500);
    }
    this.bus_current_stop = undefined;
    this.bus_destination_stop = undefined;
    this.number_of_stops = 3;
    this.stops_in_advance = 1;
    this.load_status = "Not Done";
  }

  checkIfStopIsCurrentOrDestination(index){
    if((this.bus_current_stop && this.bus_all_stop_names[index] == this.bus_current_stop['Description']) || (this.bus_destination_stop && this.bus_all_stop_names[index] == this.bus_destination_stop['Description'])){
      return true;
    } else {
      return false;
    }

  }

  calculateDistance(lat1,lng1, lat2, lng2){
    let R = 6371000;
    let φ1 = lat1*Math.PI/180;
    let φ2 = lat2*Math.PI/180;
    let Δφ = (lat1-lat2)*Math.PI/180;
    let Δλ = (lng1-lng2)*Math.PI/180;
    let a =  Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}