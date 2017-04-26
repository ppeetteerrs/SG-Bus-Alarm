import {  Pipe, PipeTransform } from '@angular/core'
//import * as _ from 'lodash' // lodash, not strictly typed

@Pipe({ name: 'busServiceFilter' })
export class BusServicePipe implements PipeTransform {
    transform(items: any[]): any[] {
      items = items.map((a) => {return a.value});
      items = items.sort();
      items = items.filter((a,i) => {return a != items[i-1]});
      return items;
    }
}