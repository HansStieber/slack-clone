import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { DmChatroomComponent } from './components/dm-chatroom/dm-chatroom.component';
import { AuthGuard } from './services/auth.guard';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'channel-chatroom/:id', component: ChatroomComponent },
      { path: 'dm-channel-chatroom/:id', component: DmChatroomComponent },
      { path: 'search', component: SearchComponent}
    ]
  },
  { path: 'imprint', component: ImprintComponent},
  { path: 'privacy', component: PrivacyPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
