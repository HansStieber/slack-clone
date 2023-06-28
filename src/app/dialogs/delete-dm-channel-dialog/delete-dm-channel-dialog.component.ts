import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DmChannelService } from 'src/app/services/dm-channel.service';

@Component({
  selector: 'app-delete-dm-channel-dialog',
  templateUrl: './delete-dm-channel-dialog.component.html',
  styleUrls: ['./delete-dm-channel-dialog.component.scss']
})
export class DeleteDmChannelDialogComponent {

  constructor(
    private dialog: MatDialog,
    private channelService: DmChannelService
  ) {}

  
  closeDialog() { 
    this.dialog.closeAll();
  }


  deleteDmChannel() {
    this.channelService.deleteDmChannelFromDb();
  }
}
