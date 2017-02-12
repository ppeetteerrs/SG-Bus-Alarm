import {  Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash' // lodash, not strictly typed

@Pipe({ name: 'uniqFilter' })
export class UniquePipe implements PipeTransform {
    transform(items: any[]): any[] {

    // lodash uniqBy function
    return _.uniqBy(items, 'ServiceNo');
    }
}