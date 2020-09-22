export class Partido{
    jugador1:string;
    jugador2:string;
    resultado:string;
    foto:string;
    fecha:string;

    constructor(jugador1:string, jugador2:string, fecha:string){
        this.fecha=fecha;
        this.jugador1=jugador1;
        this.jugador2=jugador2;
    }
}