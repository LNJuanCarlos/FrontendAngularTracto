export class Usuario {

  id: number;
  username: string;

  nombre?: string;
  correo?: string;

  enabled?: boolean;

  // ⚠️ solo se usa para login, NO se guarda
  password?: string;

  rol: string[] = [];
  almacen: string[] = [];
}