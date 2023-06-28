import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DmChannelService } from 'src/app/services/dm-channel.service';

@Component({
  selector: 'app-delete-dm-message-dialog',
  templateUrl: './delete-dm-message-dialog.component.html',
  styleUrls: ['./delete-dm-message-dialog.component.scss']
})
export class DeleteDmMessageDialogComponent {

  constructor(
    private dialog: MatDialog,
    public channelService: DmChannelService
  ) {}


  closeDialog() { 
    this.dialog.closeAll();
  }
}
