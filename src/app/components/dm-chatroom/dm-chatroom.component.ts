import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DeleteDmChannelDialogComponent } from 'src/app/dialogs/delete-dm-channel-dialog/delete-dm-channel-dialog.component';
import { DeleteDmMessageDialogComponent } from 'src/app/dialogs/delete-dm-message-dialog/delete-dm-message-dialog.component';
import { Message } from 'src/app/models/message.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DmChannelService } from 'src/app/services/dm-channel.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-dm-chatroom',
  templateUrl: './dm-chatroom.component.html',
  styleUrls: ['./dm-chatroom.component.scss']
})
export class DmChatroomComponent {
  @ViewChild('chatroomContent') chatroomContent!: ElementRef;
  public input!: FormGroup;
  public messages: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public channelService: DmChannelService,
    public authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private firestore: AngularFirestore,
    public messagesService: MessagesService
  ) {
    this.input = new FormGroup({
      'newMessage': new FormControl('', Validators.required)
    });
  } 


  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.channelService.dmChannelId = paramMap.get('id')!;
      this.channelService.getChannel();
    });
    this.getMessages();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getMessages();
      }
    });
  }


  openDeleteDmChannelDialog() {
    this.dialog.open(DeleteDmChannelDialogComponent);
  }


  openDeleteDmMessageDialog(message: string) {
    this.dialog.open(DeleteDmMessageDialogComponent);
    this.channelService.message = message;
  }


  scrollToBottom(): void {
    const chatroomContentElement: HTMLElement = this.chatroomContent.nativeElement;
    chatroomContentElement.scrollTop = chatroomContentElement.scrollHeight;
  }

  getMessages() {
    this.firestore
      .collection('directMessageChannels')
      .doc(this.channelService.dmChannelId)
      .valueChanges()
      .subscribe((channel: any) => {
        if (channel && channel.messages) {
          this.messages = channel.messages;
        } else {
          this.messages = [];
        }
        this.scrollToBottom();
      })
  }


  sendMessage() {
    const newMessage = this.createMessageObject();
  
    const docRef = this.firestore.collection('directMessageChannels').doc(this.channelService.dmChannelId);
  
    docRef.get().toPromise().then((docSnapshot: any) => {
      const previousMessages = docSnapshot.get('messages') || [];
      const lastMessage = previousMessages[previousMessages.length - 1];
  
      if (lastMessage?.authorId === newMessage.authorId && this.messagesService.isSameTime(lastMessage.time, newMessage.time)) {
        lastMessage.messageText += '\n' + newMessage.messageText;
      } else {
        previousMessages.push(newMessage);
      }
      docRef.update({ messages: previousMessages }).then(() => {
        this.input.patchValue({ newMessage: '' });
      });
    });
  }


  createMessageObject(): Message {
    return {
      authorId: this.authenticationService.currentSignedInUserId,
      messageText: this.input.value.newMessage,
      time: new Date()
    };
  }  
}
