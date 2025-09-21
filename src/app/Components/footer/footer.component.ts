import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SocialLinksComponent } from "../social-links/social-links.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SocialLinksComponent
]
})
export class AppFooterComponent {
  @Input() style_2: Boolean = false;
  @Input() primary_style: Boolean = false;
  @Input() style_3: Boolean = false;

  getYear() {
    return new Date().getFullYear();
  }
}

