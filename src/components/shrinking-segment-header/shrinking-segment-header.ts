import { Component, Input, ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the ShrinkingSegmentHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'shrinking-segment-header',
  templateUrl: 'shrinking-segment-header.html'
})
export class ShrinkingSegmentHeaderComponent {

  //Listen to scroll events and resize accordingly
  @Input('scrollArea') scrollArea: any;

  // Define how big the header area should be
  @Input('headerHeight') headerHeight: number;

  
  newHeaderHeight: any;

  constructor(
    public element: ElementRef, 
    public renderer: Renderer
  ) {

  }

  ngAfterViewInit(){

    //Set initial height
    this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');

    this.scrollArea.ionScroll.subscribe((ev) => {
      //Applies when scroll
      this.resizeHeader(ev);
    });
  }

  resizeHeader(ev){

    ev.domWrite(() => {

      this.newHeaderHeight = this.headerHeight - ev.scrollTop;

      if(this.newHeaderHeight < 0){
        this.newHeaderHeight = 0;   
      }   

      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');

    });

  }

}
