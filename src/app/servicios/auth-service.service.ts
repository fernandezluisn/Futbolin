import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  user;

  constructor(public afAuth:AngularFireAuth) { 
    this.user=this.tomarUsuario().then(res=>this.user=res);    
  }

  logOutUser(){
    return this.afAuth.signOut();
  }

  async tomarUsuario(){  
    return this.afAuth.currentUser;
  }

  registrarUsuario(mail:string, password: string){
    return new Promise((resolve, reject)=>{
      this.afAuth.createUserWithEmailAndPassword(mail, password)
      .then(userData=>resolve(userData)),
      err=>reject(err);  
      
    });
    
  }

  loginUser(email:string, password:string){
    return new Promise((resolve, reject)=>{
      this.afAuth.signInWithEmailAndPassword(email, password)
      .then( userData=>
        resolve(userData),
      
      err=>reject(err));
    });
    
    
  }
}
