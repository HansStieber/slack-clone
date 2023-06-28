import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  users!: any;
  userStatus!: string;
  onlineStatus!: string;
  currentSignedInUserId!: string;
  loggedInUserFromDb!: any;
  user: User = new User;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.getCurrenctUserCollection();
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentSignedInUserId = user.uid;
      }
    });
  }


  getUserStatus(userId: string): Observable<any> {
    return from(this.firestore.collection('users').doc(userId).get());
  }


  setUserOnlineStatus(color: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('users')
        .doc(this.currentSignedInUserId)
        .update({
          onlineStatus: color,
        })
        .then(() => {
          resolve(); // Erfolgreiches Auflösen des Promises
        })
        .catch((error) => {
          reject(error); // Fehlerbehandlung, falls ein Fehler auftritt
        });
    }); 
  }


  signIn(params: SignIn): Observable<any> {
    return from(this.auth.signInWithEmailAndPassword(
      params.email, params.password
    ));
  }


  getCurrenctUserCollection() {
    this.firestore.collection('users')
      .valueChanges()
      .subscribe((users: any) => {
        this.users = users;
        if (this.currentSignedInUserId) {
          this.getCurrentUser();
        }
      });
  }


  async getCurrentUser() {
    const docRef = this.firestore.collection('users').doc(this.currentSignedInUserId).ref;
    const docSnap = await docRef.get();
    this.loggedInUserFromDb = docSnap.data();
    this.generateUserObject();
  }


  updateStatus(newStatus: string): void {
    this.user.userStatus = newStatus;
    const userRef = this.firestore.collection('users').doc(this.currentSignedInUserId).ref;
    userRef.update({
      userStatus: newStatus,
    });
  }


  generateUserObject() {
    this.user.firstname = this.loggedInUserFromDb.firstname;
    this.user.lastname = this.loggedInUserFromDb.lastname;
    this.user.email = this.loggedInUserFromDb.email;
    this.user.userId = this.loggedInUserFromDb.userId;
    this.user.userStatus = this.loggedInUserFromDb.userStatus;
    this.user.onlineStatus = this.loggedInUserFromDb.onlineStatus;
    this.user.color = this.loggedInUserFromDb.color;
  }


  recoverPassword(email: string): Observable<void> {
    return from(this.auth.sendPasswordResetEmail(email));
  }


  async register(register: Register): Promise<any> {
    const result = await this.auth.createUserWithEmailAndPassword(register.email, register.password);

    const multiFactor: any = result.user?.multiFactor;
    const uid = multiFactor?.user.uid;
    const randomColor = this.generateRandomColor();

    const user: User = {
      firstname: register.firstname,
      lastname: register.lastname,
      email: register.email,
      userId: uid,
      userStatus: '',
      onlineStatus: '',
      color: randomColor
    }

    this.firestore.collection('users').doc(uid).set(user);
  }


  generateRandomColor(): string {
    let randomColor = '';
    do {
      randomColor = Math.floor(Math.random() * 16777215).toString(16); // Zufällige Hexadezimalzahl generieren
      randomColor = "#" + randomColor.padStart(6, "0"); // Hexadezimalzahl mit "#" voranstellen und auf 6 Stellen auffüllen
    } while (this.isColorTooLight(randomColor));
  
    return randomColor;
  }


  isColorTooLight(color: string): boolean {
    // Extrahiere die RGB-Komponenten aus der Hexadezimalfarbe
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
  
    // Berechne die Helligkeit der Farbe (Wert zwischen 0 und 255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Überprüfe, ob die Helligkeit zu hell ist (hier ist der Schwellenwert auf 160 eingestellt)
    return brightness > 160;
  }


  logout(): Observable<void> {
    return from(this.auth.signOut());
  }
}


type SignIn = {
  email: string;
  password: string;
}


type Register = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}