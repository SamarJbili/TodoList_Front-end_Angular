import { Component, OnInit } from '@angular/core';
import { ConnexionService } from '../Service/connexion.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private connexionService: ConnexionService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    this.connexionService.authenticate(email, password).subscribe(
      (response: any | boolean) => {
        if (typeof response === 'object') {
          switch (response.type) {
            case 'admin':
              if (response.id) {
                this.router.navigate(['/admin', response.id]);
              } else {
                console.error('ID de l\'utilisateur non disponible.');
              }
              break;
            case 'user':
              this.router.navigate(['/user', response.id]);
              break;
            case 'super admin':
              this.router.navigate(['/super_admin']);
              break;
            default:
              console.error('Type d\'utilisateur non reconnu.');
              break;
          }
        } else {
          console.error('L\'authentification a échoué.');
        }
      },
      error => {
        console.error('Une erreur s\'est produite : ', error);
      }
    );
  }
 
  
}
