import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCtrl = inject(LoadingController);

  isLoading = false;

  async presentLoading(content?: any) {
    this.isLoading = true;
    await this.loadingCtrl
      .create({ spinner: 'circles' })
      .then(
        async (loader: {
          present: () => Promise<any>;
          dismiss: () => Promise<any>;
        }) => {
          await loader.present().then((resp: any) => {
            if (!this.isLoading) {
              loader.dismiss().then(() => { });
            }
          });
        }
      );
  }

  async dismissLoading() {
    this.isLoading = false;
    await this.loadingCtrl.dismiss();
  }
}
