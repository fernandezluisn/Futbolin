import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { BdaService } from 'src/app/servicios/bda.service';
import { Usuario } from 'src/clases/usuario';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {

  usuarios:Usuario[];
  mejoresCinco:Usuario[];
  constructor(private bda:BdaService, private router:Router, private service:AuthServiceService) {
    this.bda.devolverListadoUsuarios().subscribe(lista=>{
      this.usuarios=lista;
      this.usuarios.sort((a,b) => a.partidosGanados - b.partidosGanados);
      this.usuarios.reverse();
      let us=new Array;
      for(let i=0; i<5; i++){
        us.push(this.usuarios[i]);
      }
      this.mejoresCinco=us;
      this.mejoresCinco.sort((a,b) => a.partidosGanados - b.partidosGanados);
      this.mejoresCinco.reverse();
    })
   }

  ngOnInit() {
  }

  cerrar(){
    this.service.logOutUser();    
    this.router.navigate(['login']);
  }

}
