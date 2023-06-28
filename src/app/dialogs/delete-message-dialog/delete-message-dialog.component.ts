import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-delete-message-dialog',
  templateUrl: './delete-message-dialog.component.html',
  styleUrls: ['./delete-message-dialog.component.scss']
})
export class DeleteMessageDialogComponent {

  constructor(
    private dialog: MatDialog,
    public channelService: ChannelService
  ) {}


  closeDialog() { 
    this.dialog.closeAll();
  }
}
