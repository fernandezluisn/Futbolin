import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from 'src/clases/usuario';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BdaService {

  listaUsuarios:Observable<Usuario[]>;

  constructor(private db:AngularFirestore) { 

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

  createUsuario(emp:Usuario): Promise<DocumentReference> {
    return this.db.collection('usuarios').add({...emp});
  }

  devolverListadoUsuarios(){
    return this.listaUsuarios;
  }
}
