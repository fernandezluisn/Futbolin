import { Component, OnInit } from '@angular/core';
import {AuthServiceService} from '../../servicios/auth-service.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  password:string;

  loading:any;
  
  opciones=["Invitado", "Tester", "Admin", "Usuario", "Ingresar con usuario propio"];
  
  constructor(private servicio:AuthServiceService, private router:Router, public alertController: AlertController, 
    private loadingCtrl: LoadingController ) { 
    this.email="";
    this.password="";

    
  }

  ngOnInit() {
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
        message,
        spinner: "dots",
        duration: 2500
    });
    return this.loading.present();

    
}

  async alertar(mensaje:string){
    const alert= this.alertController.create({
      cssClass: 'danger-alert-btn',
      header: 'Error',
      subHeader: 'Ha ingresado mal los datos.',
      message: mensaje,
      buttons: ['OK']
    });

    (await alert).present();
  }

  login(){
    if(this.password.length>5){
      this.presentLoading('Ingresando...');
      this.servicio.loginUser(this.email, this.password).then(res=>{
        this.router.navigate(['home']);
      }).catch(error=>{
        this.alertar("Los datos ingresados no son correctos.");      
      });
    }else{
      this.alertar("El password debe tener más de 5 caracteres y el correo debe tener el formato correcto."); 
    }
  }

  carg2(opcion:string){
    switch(opcion){
      case "Invitado":
        this.email="invitado@invitado.com";
        this.password="222222";
        break;
      case "Ingresar con usuario propio":
        this.email="";
        this.password="";
        break;
      case "Usuario":
        this.email="usuario@usuario.com";
        this.password="333333";
        break;
      case "Admin":
        this.email="admin@admin.com";
        this.password="111111";
        break;
      case "Tester":
        this.email="tester@tester.com";
        this.password="555555";
        break;
    }
  }
  

}
