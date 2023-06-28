import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteNoticeDialogComponentComponent } from '../dialogs/delete-notice-dialog-component/delete-notice-dialog-component.component';
import { arrayRemove } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  public allChannels: any;
  public channelId!: string;
  public channel: any;
  public channelName!: string;
  public message!: string;

  constructor(
    private firestore: AngularFirestore,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.getChannels();
  }


  getChannels() {
    this.firestore
      .collection('channels')
      .valueChanges({ idField: 'channelId' })
      .subscribe((changes: any) => {
        this.allChannels = changes;
      })
  }


  getChannel() {
    this.firestore
      .collection('channels')
      .doc(this.channelId)
      .valueChanges()
      .subscribe((channel: any) => {
        if (channel && channel.channelName) {
          this.channel = channel;
          this.channelName = channel.channelName;
        } else {
          this.channel = null; // Setze channel auf null, wenn channelName nicht definiert ist
          this.channelName = ''; // Setze channelName auf null, wenn channelName nicht definiert ist
        }
      });
  }



  deleteChannelFromDb() {
    if (this.authenticationService.user.userId === this.channel.createdFromUserId) {
      this.openSnackBar();
      this.router.navigate(['/home']);
      this.firestore
        .collection('channels')
        .doc(this.channelId)
        .delete();
      this.dialog.closeAll();
    } else {
      this.dialog.closeAll();
      this.dialog.open(DeleteNoticeDialogComponentComponent);
    }
  }


  deleteMessage() {
    this.firestore
      .collection('channels')
      .doc(this.channelId)
      .update({
        messages: arrayRemove(this.message)
      })
      .then(() => {
        console.log('Die Nachricht wurde gelöscht.');
      })
      .catch((error) => {
        console.error('Fehler beim Löschen der Nachricht:', error);
      });

    this.dialog.closeAll();
  }


  openSnackBar() {
    const message = 'Channel "' + this.channelName + '"  was deleted'
    const action = 'Got it'

    this.snackbar.open(message, action, {
      duration: 3000
    });
  }
}

