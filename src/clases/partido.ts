import { Usuario } from './usuario';

export class Partido{
    id;
    jugador1:Usuario;
    jugador2:Usuario;
    golesJug1:number;
    golesJug2:number;
    foto:string;
    fecha:string;

    constructor(jugador1:Usuario, jugador2:Usuario, fecha:string){
        this.fecha=fecha;
        this.jugador1=jugador1;
        this.jugador2=jugador2;
    }
}