export class Usuario{

    idU:number;
    id;
    correo:string;
    perfil:string;
    sexo:string;
    nombre:string;
    apellido:string;
    partidosGanados:number;
    partidosPerdidos:number;

    constructor(idU, correo, perfil, sexo, nombre, apellido){
        this.idU=idU;
        this.correo=correo;
        this.perfil=perfil;
        this.sexo=sexo;
        this.apellido=apellido;
        this.nombre=nombre;
    }
}