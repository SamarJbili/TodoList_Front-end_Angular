import { Component, OnInit } from '@angular/core';
import { ConnexionService } from '../Service/connexion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.css']
})
export class SinginComponent implements OnInit {
  addAccountForm!: FormGroup;

  constructor(private connexionService: ConnexionService, private formBuilder: FormBuilder,private route:Router) {}

  ngOnInit() {
    this.addAccountForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      type: ['']
    });
  }

  addAccount() {
    if (this.addAccountForm.invalid) {
      return;
    }

    this.connexionService.Add(this.addAccountForm.value).subscribe(
      (res) => {
        console.log(res);
        this.route.navigate(['/login'])
      });
  }
}
