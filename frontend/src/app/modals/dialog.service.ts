import {ComponentFactoryResolver, ComponentRef, Inject, Injectable, ViewContainerRef} from '@angular/core';
import {ModalDialogComponent} from './dialog.component';
import {IModalDialogOptions, ModalDialog} from './dialog.interface';

@Injectable()
export class ModalDialogService {
  private viewContainerRef: ViewContainerRef;
  private componentRef: ComponentRef<ModalDialogComponent>;

  constructor(@Inject(ComponentFactoryResolver)
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public async openDialog(component: { new(...args): ModalDialog }, dialogOptions?: IModalDialogOptions) {
    if (!this.viewContainerRef) {
      throw new Error('A ViewContainerRef must be provided first.');
    }

    dialogOptions.component = component;

    this.closeExistingDialog();

    // Dynamically create the dialog component, which will contain the child component.
    const factory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);
    const componentRef: ComponentRef<ModalDialogComponent> = this.viewContainerRef.createComponent(factory);
    const dialogInstance: ModalDialogComponent = componentRef.instance;
    dialogInstance.initialize(componentRef as any, dialogOptions);

    this.setDialogInstance(componentRef);

    // Wait until the dialog's close subject is called.
    return new Promise<any>(accept => {
      dialogInstance.close$.subscribe(data => {
        accept(data);
      });
    });
  }

  public setViewContainer(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  private closeExistingDialog() {
    if (this.componentRef) {
      this.componentRef.instance.close();
      this.componentRef.destroy();
    }
  }

  private setDialogInstance(componentRef: ComponentRef<ModalDialogComponent>) {
    this.componentRef = componentRef;
  }
}
