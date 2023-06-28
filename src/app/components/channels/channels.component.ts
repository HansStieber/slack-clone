import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelDialogComponent } from 'src/app/dialogs/add-channel-dialog/add-channel-dialog.component';
import { ChannelService } from 'src/app/services/channel.service';
import { DrawerService } from 'src/app/services/drawer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public channelService: ChannelService,
    private router: Router,
    private drawerService: DrawerService
  ) {}


  ngOnInit() { 
  }
  

  public onChannelClick() {
    this.drawerService.toggle.next(!this.drawerService.toggle.getValue());
  }


  navigateToChannel(channel: any) {
    if (window.innerWidth <= 430) {
      this.drawerService.toggle.next(false);
  
      setTimeout(() => {
        this.router.navigate(['home/channel-chatroom/' + channel.channelId]);
      }, 15);
    }
  }

  
  createNewChannel() {
    this.dialog.open(AddChannelDialogComponent)
  }
}



