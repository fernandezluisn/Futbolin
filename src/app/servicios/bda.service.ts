import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from 'src/clases/usuario';
import { map } from 'rxjs/operators';
import { Partido } from 'src/clases/partido';


@Injectable({
  providedIn: 'root'
})
export class BdaService {

  listaUsuarios:Observable<Usuario[]>;
  listaPartidos:Observable<Partido[]>;

  constructor(private db:AngularFirestore) { 

    this.listaPartidos=this.db.collection('partidos').snapshotChanges().pipe(
      map(actions=>{
        return actions.map(
          a=>{
            const data= a.payload.doc.data();
            const id=a.payload.doc.id;
            return {id, ...(data as any)}
          }
        );
      }
  
      )
  
     
    );

    this.listaUsuarios=this.db.collection('usuarios').snapshotChanges().pipe(
      map(actions=>{
        return actions.map(
          a=>{
            const data= a.payload.doc.data();
            const id=a.payload.doc.id;
            return {id, ...(data as any)}
          }
        );
      }

      )

    
    );
  }

  createPartido(emp:Partido): Promise<DocumentReference> {
    return this.db.collection('partidos').add({...emp});
  }

  createUsuario(emp:Usuario): Promise<DocumentReference> {
    return this.db.collection('usuarios').add({...emp});
  }

  devolverListadoPartidos(){
    return this.listaPartidos;
  }

  devolverListadoUsuarios(){
    return this.listaUsuarios;
  }

  actualizarPartido(partido:Partido) {     
    this.db.doc('partidos' + '/'+partido.id).update({...partido});    
  }

  actualizarUsuario(usuario:Usuario) {     
    this.db.doc('usuarios' + '/'+usuario.id).update({...usuario});    
  }
}
