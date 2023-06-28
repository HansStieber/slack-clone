import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DmChannel } from 'src/app/models/dmchannel.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DmChannelService } from 'src/app/services/dm-channel.service';

@Component({
  selector: 'app-add-dm-channel-dialog',
  templateUrl: './add-dm-channel-dialog.component.html',
  styleUrls: ['./add-dm-channel-dialog.component.scss']
})
export class AddDmChannelDialogComponent {
  selectUser: FormGroup;
  dmChannel = new DmChannel;
  selectedDmUser: any;
  selectedUserName: string = '';

  constructor(
    public dialog: MatDialog,
    public authenticationService: AuthenticationService,
    private firestore: AngularFirestore,
    public dmChannelService: DmChannelService,
    private router: Router
  ) {
    this.selectUser = new FormGroup({
      'selectedUser': new FormControl('', Validators.required)
    });
  }


  createDmChannel() {
    this.addDmChannelToDb();
    this.closeDialog();
  }


  addDmChannelToDb() {
    this.generateObject();

    this.firestore
      .collection('directMessageChannels')
      .add(this.dmChannel.toJSON()).then((docRef) => {
        this.closeDialog();
        const channelId = docRef.id;
        this.router.navigate(['/home', 'dm-channel-chatroom', channelId]);
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
  }


  generateObject() {
    this.dmChannel.memberIds = [this.selectUser.value.selectedUser.userId, this.authenticationService.user.userId];
    this.dmChannel.messages = [];
  }


  closeDialog() {
    this.dialog.closeAll();
  }


  doesDmChannelExist(user: any): boolean {
    return this.dmChannelService.allDmChannels.some((channel: { otherUserId: any; }) =>
      channel.otherUserId == user.userId
    );
  }
}
