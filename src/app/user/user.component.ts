import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnexionService } from '../Service/connexion.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  addprojectForm!: FormGroup;
  updateprojectForm!: FormGroup;
  personalProjects: any[] = [];
  staffId: number | null = null;
  staffMail!: string;
  userTasks: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private connexionService: ConnexionService
  ) {}

  ngOnInit() {
    this.addprojectForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
    this.updateprojectForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.staffId = id ? +id : null;
      
      if (this.staffId) {
        this.connexionService.getUserEmailById(this.staffId).subscribe(
          email => {
            if (email) {
              this.staffMail = email;
              this.getProjetPer();
              this.getUserTasks(this.staffMail);
            } else {
              console.error("User email is undefined");
            }
          },
          error => {
            console.error("Error fetching user email:", error);
          }
        );
      }
    });
  }

  navigateToTasks(id: number) {
    this.router.navigate(['/ajouttache', id]);
  }
  navigateToCompte() {
    this.router.navigate(['/compte', this.staffId ]);
  }

  addProject() {
    if (this.addprojectForm.valid) {
      const data = {
        name: this.addprojectForm.value.name,
        type: "Personal",
        staffID: this.staffId
      };
  
      this.connexionService.AddProject(data).subscribe(
        () => {
          this.getProjetPer();
          this.addprojectForm.reset();
        },
        error => {
          console.error("Erreur lors de l'ajout du projet :", error);
        }
      );
    } else {
      console.error("Le formulaire est invalide. Impossible de soumettre.");
    }
  }

  getProjetPer() {
    if (this.staffId !== null) {
      this.connexionService.getProjects().subscribe(
        projects => {
          this.personalProjects = projects.filter(project => project.type === 'Personal' && project.staffID === this.staffId);
        },
        error => {
          console.error("Error fetching personal projects:", error);
        }
      );
    } else {
      console.error("Staff ID is null");
    }
  }

  getUserTasks(userMail: string) {
    this.connexionService.getAllTasksPro().subscribe(
      tasks => {
        this.userTasks = tasks.filter(task => task.users === userMail);
      },
      error => {
        console.error("Error fetching user tasks:", error);
      }
    );
  }

  deleteProject(id: number) {
    this.connexionService.DeleteProject(id).subscribe(
      res => {
        console.log("Project deleted:", res);
        this.getProjetPer();
      },
      error => {
        console.error("Error deleting project:", error);
      }
    );
  }

  updateProjectName(project: any) {
    const updatedName = this.updateprojectForm.get('name')?.value;
    const data = {
      id: project.id,
      name: updatedName
    };

    this.connexionService.updateprojectName(project.id, data).subscribe(
      (res: any) => {
        console.log(res);
        project.name = updatedName;
        this.getProjetPer();
      },
      error => {
        console.error("Error updating project:", error);
      }
    );
  }

  showInput(project: any) {
    project.isEditing = true;
    project.updatedName = project.name;
  }
  createNewCompte() {
    if (this.staffId !== null) {
      const defaultCompte = {
        
        tel: 2,
       
        staffID: this.staffId
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
  
  
  

  updateTaskCompletion(task: any, event: any) {
    const taskId = task.id;
    const newCompletedValue = event.target.checked;
    const data = { completed: newCompletedValue, name: task.name, date: task.date, id: taskId };
    
    this.connexionService.updateTaskComp(taskId, data)
      .subscribe((res: any) => {
        task.completed = newCompletedValue;
        console.log("Task updated successfully:", res);
      }, error => {
        console.error("Error updating task:", error);
      });
  }
 
}
