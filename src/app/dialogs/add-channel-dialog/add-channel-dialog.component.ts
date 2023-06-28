import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Channel } from 'src/app/models/channel.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss']
})
export class AddChannelDialogComponent {
  public input: FormGroup;
  private channel: Channel = new Channel;

  constructor(
    public dialog: MatDialog,
    public channelService: ChannelService,
    private firestore: AngularFirestore,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.input = new FormGroup({
      'newChannelName': new FormControl('', [Validators.required, this.validateChannelName.bind(this)])
    });
  }


  closeDialog() {
    this.dialog.closeAll();
  }


  createChannel() {
    this.channel.channelName = this.input.value.newChannelName;
    this.channel.createdFromUserId = this.authService.currentSignedInUserId;
    this.channel.messages = [];
  
    this.firestore.collection('channels').add(this.channel.toJSON()).then((docRef) => {
      this.closeDialog();
      const channelId = docRef.id;
      this.router.navigate(['/home', 'channel-chatroom', channelId]);
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
  


  validateChannelName(control: FormControl): { [key: string]: any } | null {
    const channelName = control.value;
    const existingChannel = this.channelService.allChannels.find((channel: { channelName: string; }) => channel.channelName === channelName);

    if (existingChannel) {
      return { 'channelExists': true };
    }

    return null;
  }
}


