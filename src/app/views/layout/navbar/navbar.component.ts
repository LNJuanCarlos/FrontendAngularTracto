import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../pages/auth/login/auth.service';
import { UsuarioService } from '../../pages/auth/login/usuario.service';
import { Renderer2 } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  claveActual: string = '';
  nuevaClave: string = '';
  confirmarClave: string = '';
  

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public authService: AuthService,
    private usuarioService: UsuarioService, // <-- inyectamos el nuevo servicio
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void { }

  toggleSidebar(e: Event): void {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  // Abrir modal
  abrirCambioClave(event: Event) {
    event.preventDefault();
    ($('#cambioClaveModal') as any).modal('show'); // Usando jQuery bootstrap modal
  }

  // Método para cambiar la clave
  cambiarClave() {

  if (this.nuevaClave !== this.confirmarClave) {
    Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    return;
  }

  const user = this.authService.usuario;

console.log('Documento enviado:', user.username);

this.usuarioService.cambiarClave(
  user.username,     // DOCUMENTO
  this.claveActual,
  this.nuevaClave
).subscribe({
  next: (resp: any) => {
    Swal.fire('Éxito', resp.mensaje, 'success');
    ($('#cambioClaveModal') as any).modal('hide');
  },
  error: (err) => {
    Swal.fire(
      'Error',
      err?.error?.mensaje || 'Error al actualizar la contraseña',
      'error'
    );
  }
});
}


  logout(event: Event): void {
    event.preventDefault();

    const username = this.authService.usuario?.username || '';

    this.authService.logout();

    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: `Hasta luego ${username}`,
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

}
