import {Subject} from 'rxjs';

export abstract class ModalDialog {
  public close$: Subject<any>;
  public title: string;
  public size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  /**
   * Close the dialog.
   * @param data Any data to be passed to the close callback.
   */
  public close(data?: any) {
    if (!this.close$.isStopped) {
      this.close$.next(data);
    }
  }

  public initDialog(options?: IModalDialogOptions) {

  }
}

export interface IModalDialogOptions {
  /**
   * The child component inside the dialog.
   */
  component?: { new(): ModalDialog };

  /**
   * Data to be passed to the popup.
   */
  data?: any;
}
