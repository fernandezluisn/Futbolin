import { Component, OnInit } from '@angular/core';
 import { BdaService } from 'src/app/servicios/bda.service';
import { Partido } from 'src/clases/partido';
import { Usuario } from 'src/clases/usuario';
import { DatePipe } from "@angular/common";
import { AlertController, LoadingController } from '@ionic/angular';
import { isDefined } from '@angular/compiler/src/util';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
})
export class PartidoPage implements OnInit {

  j2;
  j1;
  usuarios:Usuario[];
  partidos:Partido[];
  fecha;
  loading;
  hayP=false;
  partEnCurso:Partido;

 

  constructor(private bda:BdaService, private datePipe: DatePipe, private alertController:AlertController,
    private loadingCtrl:LoadingController, private camera: Camera, private service:AuthServiceService, private router:Router) {
    this.bda.devolverListadoUsuarios().subscribe(lista=>{
      this.usuarios=lista;    
      this.bda.devolverListadoPartidos().subscribe(parts=>{
        this.partidos=parts;
      })  
    })

    let usu1=new Usuario(6, "pp", "", "", "Juan", "");
    let usu2=new Usuario(6, "pp", "", "", "Jorge", "");
    let part1=new Partido(usu1, usu2, "11-03-1990");
    this.generarPartido(part1);
  }
  

  ngOnInit() {
  }  

  cerrar(){
    this.service.logOutUser();    
    this.router.navigate(['login']);
  }

  tomarFoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      this.alertar(err);
     });
  }

  buscarUsuario(mail:string){
    let u:Usuario;
    this.usuarios.filter(element=>{
      if(element.correo==mail)
      u=element
    })
    return u;
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

  async presentLoading(message: string) {
    this.loading = await this.loadingCtrl.create({
        message,
        spinner: "dots",
        duration: 2500
    });
    return this.loading.present();    
  }

  generarPartido(part:Partido){
    this.hayP=true;
    this.partEnCurso=part;
  }  
  

  ingresar(){
    
    let uno=this.buscarUsuario(this.j1);
    let dos=this.buscarUsuario(this.j2);
    let f=this.datePipe.transform(this.fecha, "dd-MM-yyyy");
    if(isDefined(uno) && isDefined(dos) && isDefined(f))
    {
      
      if(uno.correo!=dos.correo)
      {
        let part=new Partido(uno, dos, f);
        this.presentLoading("Cargando partido");
        this.bda.createPartido(part); 
        this.generarPartido(part);              
      }else{
        this.alertar("Los jugadores deben ser usuarios distintos");
      }
      
    }else{
      this.alertar("Para poder iniciar el partido deben estar ingresados todos los datos.");
    } 
    
    
  }

  subirResultado(){
    
  }

}
