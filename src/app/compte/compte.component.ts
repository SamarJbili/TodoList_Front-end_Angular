import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConnexionService } from '../Service/connexion.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  updateCompteForm!: FormGroup;
  addCompteForm!: FormGroup;
  loggedInMail: string = ''; 
  staffId: number | null = null;
  comptes!: any;
  imageSrc: string | ArrayBuffer | null = null;


  constructor(private connexionService: ConnexionService,private route:ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.staffId = id ? +id : null; // Convertir l'ID en nombre ou le laisser null
      this.getCompte(); 
    });
    
    this.updateCompteForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      tel: new FormControl('', [Validators.required, Validators.minLength(8)]),
      adress: new FormControl('', [Validators.required, Validators.minLength(4)]),
      twitter: new FormControl('', [Validators.required, Validators.minLength(4)]),
      linkedin: new FormControl('', [Validators.required, Validators.minLength(4)]),
      gethub: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }
  
  getCompte() {
    if (this.staffId !== null) {
      this.connexionService.getCompte().subscribe(comptes => {
        this.comptes = comptes.filter(compte => compte.staffID === this.staffId);
      
        this.updateCompteForm.patchValue({
          name: this.comptes.name,
          tel: this.comptes.tel,
          adress: this.comptes.adress,
          twitter: this.comptes.twitter,
          linkedin: this.comptes.linkedin,
          gethub: this.comptes.gethub
        });
      });
      
    }
  }
  

  updateCompte(compte: any) {
    if (compte && compte.id) {
      const formData = this.updateCompteForm.value;
      formData.id = compte.id;
      this.connexionService.updateCompte(compte.id, formData).subscribe(() => {
        this.updateCompteForm.reset();
        this.getCompte();
      });
    } else {
      console.error("L'identifiant du compte n'est pas défini.");
    }
}
}

  


  

