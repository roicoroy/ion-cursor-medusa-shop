import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../../components/image-modal/image-modal/image-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ImageModalService {

  private modalController = inject(ModalController);

  constructor() { }

  async openImageModal(imageUrl: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        imageUrl: imageUrl
      },
      cssClass: 'image-modal-fullscreen'
    });
    return await modal.present();
  }
}
