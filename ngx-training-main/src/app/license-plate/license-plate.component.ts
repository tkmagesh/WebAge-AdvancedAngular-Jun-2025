import {Component, Input} from '@angular/core';
import {LicensePlate} from '../license-plate';
import { CurrencyRendererPipe } from "../currency-renderer.pipe";
@Component({
  selector: 'app-license-plate',
  templateUrl: './license-plate.component.html',
  styleUrls: ['./license-plate.component.css'],
  imports : [CurrencyRendererPipe]
})
export class LicensePlateComponent {

  @Input()
  plate!: LicensePlate;

  @Input()
  buttonText!: string;

  buttonClicked(): void {
    alert("Plate added to cart");
  }

}
