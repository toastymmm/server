import {Component, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {IModalDialogOptions, ModalDialog} from './dialog.interface';
import {Subject} from 'rxjs';
import {animate, AnimationEvent, style, transition, trigger, query, group} from '@angular/animations';

@Component({
  selector: 'modal-dialog',
  animations: [
    trigger(
      'fadeAnimation', [
        transition('* => show', [
          group([
            query(':self', [
              style({opacity: 0}),
              animate('300ms ease', style({opacity: 1})),
            ]),
            query('.modal-content', [
              style({transform: 'translateY(-50px)'}),
              animate('350ms ease', style({transform: 'translateY(0)'}))
            ], {optional: true})
          ])
        ]),
        transition('* => hide', [
          style({opacity: 1}),
          animate('200ms ease', style({opacity: 0}))
        ])
      ]
    )
  ],
  template: `
    <div
      [@fadeAnimation]="animationState"
      (@fadeAnimation.done)="animationDone($event)"
      class="modal">
      <div [ngClass]="'modal-dialog modal-' + size">
        <div class="modal-content-wrapper">
          <div class="modal-content" role="dialog">
            <div class="modal-header">
              <button aria-label="Close" class="close" type="button" (click)="close()">
                <clr-icon aria-hidden="true" shape="close"></clr-icon>
              </button>
              <div class="modal-title-wrapper">
                <h3 class="modal-title">{{title}}</h3>
              </div>
            </div>
            <div #modalDialogBody></div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop" (click)="close()"></div>
    </div>
  `
})
export class ModalDialogComponent implements OnDestroy {
  @ViewChild('modalDialogBody', {read: ViewContainerRef})
  public dynamicComponentTarget: ViewContainerRef;
  public reference: ComponentRef<ModalDialog>;

  public animationState: 'show' | 'hide' = 'show';
  public title: string;
  public size: string;

  public close$: Subject<any>;

  private componentFactoryResolver: ComponentFactoryResolver;
  private inProgress = false;
  private childInstance: ModalDialog;

  constructor(componentFactoryResolver: ComponentFactoryResolver) {
    this.componentFactoryResolver = componentFactoryResolver;
  }

  /**
   * Initialize dialog with reference to instance and options
   */
  initialize(reference: ComponentRef<ModalDialog>, options?: IModalDialogOptions) {
    this.reference = reference;

    // Dynamically create the child component.
    if (options && options.component) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(options.component);
      const componentRef = this.dynamicComponentTarget.createComponent(factory) as ComponentRef<ModalDialog>;
      this.childInstance = componentRef.instance as ModalDialog;

      this.close$ = new Subject<any>();
      this.close$.subscribe(() => {
        if (this.inProgress) {
          return;
        }
        this.inProgress = true;
        this.finalizeAndDestroy();
      });
      this.childInstance.close$ = this.close$;

      this.childInstance.initDialog(options);

      (document.activeElement as HTMLElement).blur();

      this.title = this.childInstance.title;
      this.size = this.childInstance.size;
    }
  }

  public close() {
    // Call the close event, which will trigger finalizeAndDestroy and cause the openDialog promise to be resolved.
    if (!this.childInstance.close$.closed) {
      this.childInstance.close$.next();
    }
  }

  ngOnDestroy() {
    // Cleanup when destroyed.
    if (this.close$) {
      this.close$.unsubscribe();
    }
  }

  public animationDone(event: AnimationEvent) {
    if (event.toState === 'hide') {
      this.inProgress = false;
      this.reference.destroy();
    }
  }

  private finalizeAndDestroy() {
    this.animationState = 'hide';
  }
}
