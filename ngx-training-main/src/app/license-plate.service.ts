import { Injectable } from '@angular/core';
import { LICENSE_PLATES } from "./mock-data";
import { LicensePlate } from "./license-plate";

@Injectable({
  providedIn: 'root'
})
export class LicensePlateService {

  getList(): LicensePlate[] {
    return LICENSE_PLATES;
  }
}
