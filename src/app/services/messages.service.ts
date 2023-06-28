import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  public messages: any = [];

  private searchSource = new BehaviorSubject<string>('');
  currentSearch = this.searchSource.asObservable();

  constructor(
    private authenticationService: AuthenticationService,
    private firestore: AngularFirestore
  ) { }


  getUserFirstname(): string {
    const loggedInUser = this.authenticationService.user;
    return loggedInUser ? loggedInUser.firstname : '';
  }


  getUserInitialsById(userId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === userId);
    if (user) {
      const firstLetter = user.firstname.charAt(0).toUpperCase();
      const lastLetter = user.lastname.charAt(0).toUpperCase();
      return firstLetter + lastLetter;
    } else {
      throw new Error('Benutzer nicht gefunden');
    }
  }


  getUserColor(userId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === userId);
    if (user) {
      return user.color;
    } else {
      return '';
    }
  }


  getUserOnlineStatus(userId: string): string {
    const user = this.authenticationService.users.find((obj: { userId: string; }) => obj.userId === userId);
    if (user) {
      return user.onlineStatus;
    } else {
      return '';
    }
  }


  isSameTime(timestamp: any, time1: Date): boolean {
    const time2 = timestamp.toDate();
    return (
      time1.getHours() === time2.getHours() &&
      time1.getMinutes() === time2.getMinutes()
    );
  }


  formatTime(timestamp: any) {
    const date = timestamp.toDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  }


  formatMessageText(messageText: string): string {
    const formattedText = messageText.replace(/\n/g, '<br>');
    return formattedText;
  }


  loadAllMessages() {
    const currentUserID = this.authenticationService.currentSignedInUserId;
    this.messages = [];
  
    this.firestore.collection('directMessageChannels').get().subscribe((dmSnapshot) => {
      dmSnapshot.forEach((dmDoc: any) => {
        const memberIDs = dmDoc.data().memberIds || [];
        if (memberIDs.includes(currentUserID)) {
          const dmMessages = dmDoc.data().messages || [];
          this.messages.push(...dmMessages);
        }
      });
  
      this.firestore.collection('channels').get().subscribe((channelSnapshot) => {
        channelSnapshot.forEach((channelDoc: any) => {
          const channelMessages = channelDoc.data().messages || [];
          this.messages.push(...channelMessages);
        });
      });
    });
  }
  

  changeSearch(search: string) {
    this.searchSource.next(search);
  }
}
