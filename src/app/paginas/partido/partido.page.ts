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
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
})
export class PartidoPage implements OnInit {

  g1:number;
  g2:number;
  j2;
  j1;
  usuarios:Usuario[];
  partidos:Partido[];
  fecha;
  loading;
  hayP=false;
  partEnCurso:Partido;
  image:string=null;
  

  constructor(private storage:AngularFireStorage, private bda:BdaService, private datePipe: DatePipe, 
    private alertController:AlertController, private loadingCtrl:LoadingController, private camera: Camera, 
    private service:AuthServiceService, private router:Router) {
    this.bda.devolverListadoUsuarios().subscribe(lista=>{
      this.usuarios=lista;    
      this.bda.devolverListadoPartidos().subscribe(parts=>{
        this.partidos=parts;
      })  
    })    
  }
  

  ngOnInit() {
  }  

  cerrar(){
    this.service.logOutUser();    
    this.router.navigate(['login']);
  }

  async tomarFoto(){
    this.presentLoading("Cargando imagen");
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000
    }

    await this.camera.getPicture(options).then((imageData) => {
      this.image = `data:image/jpeg;base64,${imageData}`;   
        
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
        duration: 3500
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
         
        this.generarPartido(part);              
      }else{
        this.alertar("Los jugadores deben ser usuarios distintos");
      }
      
    }else{
      this.alertar("Para poder iniciar el partido deben estar ingresados todos los datos.");
    } 
    
    
  }

  async subirResultado(){
    if(this.g1+this.g2==7){
        if(this.image){
          this.presentLoading("Subiendo resultado");
    
          try{
          const com=this.fecha+Math.random()*1000+this.partEnCurso.jugador1.apellido+this.partEnCurso.jugador2.apellido;
          let img;
          await fetch(this.image)
          .then(res => res.blob().then(r=>{
            img=r
          }))
          
          const file= img;
          const path= com;
          const ref=this.storage.ref(path);    
          const task=this.storage.upload(path, file);     
          task.snapshotChanges().pipe(finalize(()=>ref.getDownloadURL().subscribe(url=>{        
            this.partEnCurso.foto=url;
            this.partEnCurso.golesJug1=this.g1;
            this.partEnCurso.golesJug2=this.g2;
          this.bda.createPartido(this.partEnCurso);
          let jug1=this.partEnCurso.jugador1;
          let jug2=this.partEnCurso.jugador2;
          if(this.g1>this.g2){
            jug1.partidosGanados++;
            jug2.partidosPerdidos++;
            this.bda.actualizarUsuario(jug2);
            this.bda.actualizarUsuario(jug1);
          }else{
            jug2.partidosGanados++;
            jug1.partidosPerdidos++;
            this.bda.actualizarUsuario(jug2);
            this.bda.actualizarUsuario(jug1);
          }
          } ))).subscribe(); 
          this.router.navigate(['lista-partidos']);
          }catch(err){
          this.alertar(err);
          
          }    
        }else{
          this.presentLoading("Subiendo resultado");
          this.partEnCurso.golesJug1=this.g1;
            this.partEnCurso.golesJug2=this.g2;
          this.bda.createPartido(this.partEnCurso);
          let jug1=this.partEnCurso.jugador1;
          let jug2=this.partEnCurso.jugador2;
          if(this.g1>this.g2){
            jug1.partidosGanados++;
            jug2.partidosPerdidos++;
            this.bda.actualizarUsuario(jug2);
            this.bda.actualizarUsuario(jug1);
          }else{
            jug2.partidosGanados++;
            jug1.partidosPerdidos++;
            this.bda.actualizarUsuario(jug2);
            this.bda.actualizarUsuario(jug1);
          }
          this.router.navigate(['lista-partidos']);
        }
      }else{
        this.alertar("El partido debe sumar 7 goles.");
      }

  }
    

}
