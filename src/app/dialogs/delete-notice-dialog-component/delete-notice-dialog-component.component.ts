import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-notice-dialog-component',
  templateUrl: './delete-notice-dialog-component.component.html',
  styleUrls: ['./delete-notice-dialog-component.component.scss']
})
export class DeleteNoticeDialogComponentComponent {

  constructor(public dialog: MatDialog) { }

  closeDialog() {
    this.dialog.closeAll();
  }
}
