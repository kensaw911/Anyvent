import { Component, Input } from '@angular/core';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  @Input()
  title: string;

  constructor() {}

  openNav() {
    document.getElementById("mySidenav").style.width = "49%";
    let tabs = document.getElementsByClassName("tabs")[0] as HTMLElement;
    tabs.style.transition = "0.3s";
    tabs.style.marginLeft = "49%";

  }
}
