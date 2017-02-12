import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//Linked Pages
import { Pages } from '../pages';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  Alarm;

  constructor(public navCtrl: NavController) {
    this.Alarm = Pages[1];
  }

  ionViewDidLoad() {
    console.log('Hello HomePage Page');
  }

}
