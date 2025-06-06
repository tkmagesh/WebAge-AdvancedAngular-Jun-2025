import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  @HostBinding('style.backgroundColor')
  backgroundColor: string = '';

  constructor() { }

  @HostListener('mouseover')
  onMouseOver(): void {
    this.backgroundColor = '#F5F5F5';
  }

  @HostListener('mouseout')
  onMouseOut(): void {
    this.backgroundColor = '';
  }



}
