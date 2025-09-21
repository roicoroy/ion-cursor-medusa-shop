import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class SocialLinksComponent {

  public social_data = [
    {
      id: 1,
      link: 'https://www.facebook.com/',
      icon: 'fa-brands fa-facebook-f',
      title: 'Facebook'
    },
    {
      id: 3,
      link: 'https://www.linkedin.com/',
      icon: 'fa-brands fa-linkedin-in',
      title: 'Linkedin'
    },
  ]
}
