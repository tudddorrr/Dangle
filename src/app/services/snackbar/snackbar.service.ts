import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarRef } from '@angular/material';

@Injectable()
export class SnackbarService {

  constructor(private snackbar: MdSnackBar) { }

  create(message: string, action?: string, duration?: number): MdSnackBarRef<any> {
    if(!action) action = 'Dismiss';
    if(!duration) duration = 5000;

    let ref: MdSnackBarRef<any> = this.snackbar.open(message, action, {duration: duration});
    ref.onAction().subscribe(() => {
      ref.dismiss();
    });

    return ref;
  }
}
