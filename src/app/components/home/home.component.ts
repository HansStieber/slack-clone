import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from 'src/app/services/messages.service';
import { DrawerService } from 'src/app/services/drawer.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HostListener } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        opacity: 1,
        width: '200px'
      })),
      state('out', style({
        opacity: 0,
        width: '0px'
      })),
      transition('in => out', animate('0.5s ease-out')),
      transition('out => in', animate('0.5s ease-in'))
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  public value: string = '';
  @ViewChild('searchAllMessages') searchAllMessages!: ElementRef;
  @ViewChild('drawer') drawer!: MatDrawer;
  private subscription!: Subscription;
  searchFieldState: string = 'out';
  menusState: string = 'in';

  constructor(
    public authenticationService: AuthenticationService,
    public dialog: MatDialog,
    public router: Router,
    private firestore: AngularFirestore,
    public messagesService: MessagesService,
    private drawerService: DrawerService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    if (window.innerWidth > 992) {
      this.searchFieldState = 'in';
    }
    if (window.innerWidth <= 430) {
      this.subscription = this.drawerService.toggle.subscribe(value => {
        if (value) {
          this.drawer.open();
        }
        else {
          if (this.drawer) {
            this.drawer.close();
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    if (window.innerWidth > 992) {
      this.searchFieldState = 'in';
    } else {
      this.searchFieldState = 'out';
    }
  }


  public toggleDrawer() {
    this.drawerService.toggle.next(false);
  }


  getUserFirstname(): string {
    const loggedInUser = this.authenticationService.user;
    return loggedInUser ? loggedInUser.firstname : '';
  }

  getUserInitials(): string {
    const loggedInUser = this.authenticationService.user;
    return loggedInUser ? `${loggedInUser.firstname.charAt(0).toUpperCase()}${loggedInUser.lastname.charAt(0).toUpperCase()}` : '';
  }

  getUserOnlineStatus(): string {
    const loggedInUser = this.authenticationService.loggedInUserFromDb;
    return loggedInUser ? loggedInUser.onlineStatus : '';
  }

  logout() {
    this.authenticationService.setUserOnlineStatus('red').then(() => {
      this.authenticationService.logout().subscribe(() => {
        this.router.navigate(['login']);
      });
    })
  }

  onMenuItemClick(newText: string, button: HTMLElement): void {
    button.innerText = newText;
    this.firestore
      .collection('users')
      .doc(this.authenticationService.user.userId)
      .update({
        userStatus: newText,
      });
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onKeyUpEvent() {
    let searchValue = this.searchAllMessages.nativeElement.value.toLowerCase();
    this.messagesService.changeSearch(searchValue);
    setTimeout(() => {
      if (searchValue) {
        this.router.navigate(['home/search']);
      }
    }, 200);
  }

  toggleSearchField() {
    if (window.innerWidth <= 992 && this.drawer) {
      this.searchFieldState = this.searchFieldState === 'out' ? 'in' : 'out';
      this.menusState = this.menusState === 'in' ? 'out' : 'in';
    } else {
      this.searchAllMessages.nativeElement.focus();
    }
  }
}
