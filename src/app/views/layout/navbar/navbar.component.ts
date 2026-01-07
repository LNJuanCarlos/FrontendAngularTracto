import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../pages/auth/login/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  toggleSidebar(e: Event): void {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
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
