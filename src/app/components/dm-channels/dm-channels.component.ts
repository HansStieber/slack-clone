import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDmChannelDialogComponent } from 'src/app/dialogs/add-dm-channel-dialog/add-dm-channel-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DmChannelService } from 'src/app/services/dm-channel.service';
import { Router } from '@angular/router'; 
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-dm-channels',
  templateUrl: './dm-channels.component.html',
  styleUrls: ['./dm-channels.component.scss']
})
export class DmChannelsComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dmChannelService: DmChannelService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private drawerService: DrawerService 
  ) { }


  ngOnInit() {
    this.dmChannelService.getAllDmChannels();
  }


  navigateToDmChannel(dmChannel: any) {
    if (window.innerWidth <= 430) {
      this.drawerService.toggle.next(false);

      setTimeout(() => {
        this.router.navigate(['home/dm-channel-chatroom/' + dmChannel.dmChannelId]);
      }, 0);
    }
  }


  openAddDmChannelDialog() {
    this.dialog.open(AddDmChannelDialogComponent);
  }


  getUserInitialsById(otherUserId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === otherUserId);
    if (user) {
      const firstLetter = user.firstname.charAt(0).toUpperCase();
      const lastLetter = user.lastname.charAt(0).toUpperCase();
      return firstLetter + lastLetter;
    } else {
      throw new Error('Benutzer nicht gefunden');
    }
  }


  getUsernameById(otherUserId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === otherUserId);
    if (user) {
      return `${user.firstname} ${user.lastname}`;
    } else {
      throw new Error('Benutzer nicht gefunden');
    }
  }


  getUserStatusById(otherUserId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === otherUserId);
    if (user) {
      const userActivityStatus = user.userStatus.substring(user.userStatus.length - 2);
      return userActivityStatus;
    } else {
      return '';
    }
  }

  
  getUserOnlineStatus(otherUserId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === otherUserId);
    if (user) {
      return user.onlineStatus;
    } else {
      return '';
    }
  }


  getUserColor(otherUserId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === otherUserId);
    if (user) {
      return user.color;
    } else {
      return '';
    }
  }
}
