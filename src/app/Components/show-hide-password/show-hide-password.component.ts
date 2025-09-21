import { Component, ContentChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: [
    './show-hide-password.component.scss'
  ],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
  ],
})
export class ShowHidePasswordComponent {
  show = false;

  @ContentChild(IonInput, { static: false }) input!: IonInput;

  constructor() { }

  toggleShow() {
    this.show = !this.show;
    // if (this.show) {
    //   this.input.type = 'text';
    // } else {
    //   this.input.type = 'password';
    // }
  }
}
