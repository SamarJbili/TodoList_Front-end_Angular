import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConnexionService } from '../Service/connexion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  addProjectForm!: FormGroup;
  personalProjects: any[] = [];
  professionalProjects: any[] = [];
  updateprojectForm!: FormGroup;
  staffId: number | null = null;

  constructor(private router: Router, private connexionService: ConnexionService ,private route: ActivatedRoute) {}

  ngOnInit() {
    this.addProjectForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
    this.updateprojectForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.staffId = id ? +id : null; // Convertir l'ID en nombre ou le laisser null
      this.getPersonalProjects(); 
      this.getProfessionalProjects(); 
    });
}

addProject(newType: string) {
  if (this.addProjectForm.valid) {
    const data = {
      name: this.addProjectForm.value.name,
      type: newType,
      staffID: this.staffId
    };

    this.connexionService.AddProject(data).subscribe(
      () => {
        this.getPersonalProjects();
        this.getProfessionalProjects();
        this.addProjectForm.reset();
      },
      error => {
        console.error("Error adding project:", error);
      }
    );
  } else {
    console.error("Form is invalid. Cannot submit.");
  }
}



getPersonalProjects() {
  if (this.staffId !== null) {
    this.connexionService.getProjects().subscribe(
      projects => {
        this.personalProjects = projects
          .filter(project => project.staffID === this.staffId && (project.type === 'Personal' || project.type === 'personal'));
      },
      error => {
        console.error("Error fetching personal projects:", error);
      }
    );
  } else {
    console.error("Staff ID is null");
  }
}

getProfessionalProjects() {
  if (this.staffId !== null) {
    this.connexionService.getProjects().subscribe(
      projects => {
        this.professionalProjects = projects
          .filter(project => project.staffID === this.staffId && (project.type === 'Professional'));
      },
      error => {
        console.error("Error fetching professional projects:", error);
      }
    );
  } else {
    console.error("Staff ID is null");
  }
}


deleteProject(id: number) {
  this.connexionService.DeleteProject(id).subscribe(res=> {
    this.getPersonalProjects();
    this.getProfessionalProjects();
  });
}

updateProjectName(project: any) {
  const updatedName = this.updateprojectForm.get('name')?.value;
  const data = {
    id: project.id,
    name: updatedName
  };

  this.connexionService.updateprojectName(project.id, data).subscribe((res: any) => {
    project.name = updatedName;
    this.getPersonalProjects();
    this.getProfessionalProjects();
  }, error => {
    console.error("Error updating task:", error);
  });
}

navigateToTasks(id: number) {
  this.router.navigate(['/ajouttache', id]);
}

navigateToTasksPro(id: number) {
  this.router.navigate(['/tasks', id]);
}

navigateToCompte() {
  this.router.navigate(['/compte', this.staffId ]);
}

createNewCompte() {
  if (this.staffId !== null) {
    const defaultCompte = {
      
      tel: 2,
     
      StaffID: this.staffId // Utiliser StaffID ici
    };

    this.connexionService.createCompte(this.staffId, defaultCompte).subscribe(
      (response) => {
        console.log('Nouveau compte créé avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de la création du nouveau compte :', error);
      }
    );
  } else {
    console.error('Staff ID is null');
  }
}







showInput(project: any) {
  project.isEditing = true;
  project.updatedName = project.name;
}
}
