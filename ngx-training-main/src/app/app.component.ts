import { Component, inject } from '@angular/core';
import {CALIFORNIA_PLATE, LICENSE_PLATES} from "./mock-data";
import {LicensePlate} from "./license-plate";
import { NavigationComponent } from './navigation/navigation.component';
import { JumbotronComponent } from "./jumbotron/jumbotron.component";
import { LicensePlateComponent } from "./license-plate/license-plate.component";
import { LicensePlateService } from './license-plate.service';
@Component({
    selector: 'app-root',
  imports: [NavigationComponent, JumbotronComponent, LicensePlateComponent],
    templateUrl : 'app.component.html'
})
export class AppComponent {
  licensePlates: LicensePlate[] = inject(LicensePlateService).getList();
  licensePlate: LicensePlate = CALIFORNIA_PLATE;
}
