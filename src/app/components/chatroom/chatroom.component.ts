import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DeleteChannelDialogComponent } from 'src/app/dialogs/delete-channel-dialog/delete-channel-dialog.component';
import { DmChannelService } from 'src/app/services/dm-channel.service';
import { Message } from 'src/app/models/message.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DeleteMessageDialogComponent } from 'src/app/dialogs/delete-message-dialog/delete-message-dialog.component';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @ViewChild('chatroomContent') chatroomContent!: ElementRef;
  public input: FormGroup;
  public messages: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public channelService: ChannelService,
    public dmChannelService: DmChannelService,
    public authenticationService: AuthenticationService,
    private firestore: AngularFirestore,
    public messagesService: MessagesService
  ) {
    this.input = new FormGroup({
      'newMessage': new FormControl('', Validators.required)
    });
  }


  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.channelService.channelId = paramMap.get('id')!;
      this.channelService.getChannel();
    });
    this.getMessages();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getMessages();
      }
    });
  }


  openDeleteMessageDialog(message: string) {
    this.dialog.open(DeleteMessageDialogComponent);
    this.channelService.message = message;
  }


  openDeleteChannelDialog() {
    this.dialog.open(DeleteChannelDialogComponent);
  }

  scrollToBottom(): void {
    const chatroomContentElement: HTMLElement = this.chatroomContent.nativeElement;
    chatroomContentElement.scrollTop = chatroomContentElement.scrollHeight;
  }

  getMessages() {
    this.firestore
      .collection('channels')
      .doc(this.channelService.channelId)
      .valueChanges()
      .subscribe((channel: any) => {
        if (channel && channel.messages) {
          this.messages = channel.messages;
        } else {
          this.messages = [];
        }
        this.scrollToBottom();
      });
  }


  sendMessage() {
    const newMessage = this.createMessageObject();
    const docRef = this.firestore.collection('channels').doc(this.channelService.channelId);

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

