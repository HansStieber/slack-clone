import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-delete-channel-dialog',
  templateUrl: './delete-channel-dialog.component.html',
  styleUrls: ['./delete-channel-dialog.component.scss']
})
export class DeleteChannelDialogComponent {

  constructor(
    private dialog: MatDialog,
    private channelService: ChannelService
  ) {}

  
  closeDialog() {
    this.dialog.closeAll();
  } 


  deleteChannel() {
    this.channelService.deleteChannelFromDb();
  }
}
