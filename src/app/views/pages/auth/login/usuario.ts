export class Usuario {

  username: string;     // DOCUMENTO (DNI / RUC)
  persona: number;      // ID PERSONA (127478)

  nombre?: string;
  correo?: string;

  enabled?: boolean;

  // solo para login
  password?: string;

  rol: string[] = [];
  almacen: string[] = [];
}