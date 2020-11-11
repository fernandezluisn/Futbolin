import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { AuthServiceService } from 'src/app/servicios/auth-service.service';
import { BdaService } from 'src/app/servicios/bda.service';
import { Partido } from 'src/clases/partido';

@Component({
  selector: 'app-lista-partidos',
  templateUrl: './lista-partidos.page.html',
  styleUrls: ['./lista-partidos.page.scss'],
})
export class ListaPartidosPage implements OnInit {

  partidos:Partido[];
  

  constructor(private service:AuthServiceService, private router:Router, private bda:BdaService) { 
    let l=null;
    l=new Array();
    this.bda.devolverListadoPartidos().subscribe(lista=>{
      lista.filter(element=>{
        if(element.golesJug1+element.golesJug2==7)
        l.push(element);
      })

     
    })
    l.sort((a,b) => Number(Date.parse(a.fecha.toString())) - Number(Date.parse(b.fecha.toString())));
    l.reverse();
    this.partidos=l;
    
  }

  ngOnInit() {
  }

  cerrar(){
    this.service.logOutUser();    
    this.router.navigate(['login']);
  }

}
