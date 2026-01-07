import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: any;

  titulo: String = 'Por favor inicie sesión!'; 
  usuario: Usuario;

  constructor(private authServie: AuthService, private router: Router, private route: ActivatedRoute) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if(this.authServie.isAuthenticated()){
      localStorage.setItem('isLoggedin', 'true');
      if (localStorage.getItem('isLoggedin')) {
        this.router.navigate([this.returnUrl]);
      }
      let usuario = this.authServie.usuario;
      Swal.fire('Login', `Hola ${usuario.username}, ya haz iniciado sesión anteriormente!`, 'info');
    }
  }

  onLoggedin(e) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate([this.returnUrl]);
    }
  }

  login(): void {

  if (!this.usuario.username || !this.usuario.password) {
    Swal.fire('Error Login', 'Usuario o contraseña vacíos', 'error');
    return;
  }

  this.authServie.login(this.usuario).subscribe(
    response => {

      this.authServie.guardarUsuario(
        response.persona,
        this.usuario.username,
        response.acces_token
      );

      this.router.navigate([this.returnUrl]);

      Swal.fire(
        'Login',
        'Has iniciado sesión con éxito!',
        'success'
      );
    },
    err => {
      Swal.fire(
        'Error Login',
        err.error?.mensaje || 'Usuario o contraseña incorrectos',
        'error'
      );
    }
  );
}

}
