import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  public search!: any;

  constructor(
    public messagesService: MessagesService,
    private firestore: AngularFirestore,
    private router: Router
  ) { }


  ngOnInit() {
    this.messagesService.currentSearch.subscribe(search => {
      this.search = search;
    });
  }
  

  async openChannel(message: string) {
    const collections = ['directMessageChannels', 'channels'];
    for (const collection of collections) {
      const querySnapshot = await this.firestore.collection(collection).ref.where('messages', 'array-contains', message).get();

      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0].id;
        if(collection == 'directMessageChannels') {
        this.router.navigate(['home/dm-channel-chatroom/' + document]);
        }
        if(collection == 'channels') {
        this.router.navigate(['home/channel-chatroom/' + document]);
        }
      }
    }
  }
}
