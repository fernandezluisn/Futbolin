import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Usuario } from 'src/clases/usuario';
import { AuthServiceService } from '../servicios/auth-service.service';
import { BdaService } from '../servicios/bda.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  listado:Usuario[];
  user;
  usuarioLogeado:Usuario;
  esAdmin=false;
  anda=false;
  loading

  constructor(private bda:BdaService, private service:AuthServiceService, private router:Router, 
    private loadingCtrl: LoadingController) {
    this.service.tomarUsuario().then(element=>
      {
        this.user=element;
        console.log(element);
        this.bda.devolverListadoUsuarios().subscribe(lista=>{      
          let listaO=this.ordenar(lista);
          this.listado=listaO;

          lista.filter(elementF=>{
            if(elementF.correo==this.user.email){
              this.usuarioLogeado=elementF;
              if(this.usuarioLogeado.perfil=="Admin"){
                this.esAdmin=true;
              }
              this.anda=true;
            }
          })
        })
      }
      );
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
        message,
        spinner: "bubbles",
        duration: 2500
    });
    return this.loading.present();

    
  }

  ordenar(lista){
    lista.sort(function (a, b) {
      if (a.apellido > b.apellido) {
        return 1;
      }
      if (a.apellido < b.apellido) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return lista;
  }

}
