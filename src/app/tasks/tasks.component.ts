import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConnexionService } from '../Service/connexion.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  staffMail: any[] = [];
  projectId: number | null = null; 
  updatetaskForm!:FormGroup;
  addtaskForm!: FormGroup;
  tasks: any[] = [];
  completedTasks: any[] = [];
  incompletedTasks: any[] = [];
  adduserForm!:FormGroup
  constructor(private http: HttpClient,private connexionService:ConnexionService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.addtaskForm=new FormGroup({
      name : new FormControl('', [Validators.required]),
      users : new FormControl('')
    });
  
    this.updatetaskForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });

    this.getUserfMail();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.projectId = id ? +id : null; // Convertir l'ID en nombre ou le laisser null
    });
    this.getAllTasks();
  }

  getUserfMail() {
    this.connexionService.GetAllUser().subscribe(res => {
      this.staffMail = res;
    });
  }

getAllTasks() {
  this.connexionService.getAllTasksPro().subscribe(res => {
      if (this.projectId !== null) {
          
          this.tasks = res.filter(task => task.projectID === this.projectId);
          
          this.completedTasks = this.tasks.filter(task => task.completed);
          this.incompletedTasks = this.tasks.filter(task => !task.completed);

          console.log(this.tasks); 
      } else {
          console.error("Project ID is null");
      }
      
  });
}
addTask() {
  if (this.projectId !== null && this.addtaskForm.valid) { // Vérifier si le formulaire est valide
    console.log(this.addtaskForm.value);

    // Ajouter l'ID du projet dans les données de la tâche
    const taskData = {
      ...this.addtaskForm.value,
      completed: false,
      projectId: this.projectId // Ajouter l'ID du projet ici
    };

    this.connexionService.AddTaskPro(  this.projectId ,taskData).subscribe((res: any) => {
      console.log(res);
      // Réinitialiser le formulaire après l'ajout de la tâche
      this.addtaskForm.reset();
      this.getAllTasks();
    }, error => {
      console.error("Error adding task:", error);
    });
  } else {
    console.error("Project ID is null or form is invalid");
  }
}

  deleteTask(id: number) {
    this.connexionService.DeleteTasksPro(id).subscribe((res: any) => {
      console.log("🚀 ~ AjouttachesComponent ~ this.connexionService.DeleteTasksPers ~ res :", res);

      // Recherche de l'index de la tâche dans la liste tasks
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        // Suppression de l'élément de la liste tasks
        this.tasks.splice(index, 1);
        // Supprimer de la liste des tâches complétées ou incomplétées
        const completedIndex = this.completedTasks.findIndex((task) => task.id === id);
        if (completedIndex !== -1) {
          this.completedTasks.splice(completedIndex, 1);
        } else {
          const incompletedIndex = this.incompletedTasks.findIndex((task) => task.id === id);
          if (incompletedIndex !== -1) {
            this.incompletedTasks.splice(incompletedIndex, 1);
          }
        }
      }
      this.getAllTasks();
    });
  }


  
  getCompletedTasksCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }
  
  getIncompletedTasksCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  updateTaskName(task: any) {
    // Créez un nouveau formulaire pour la mise à jour du nom de la tâche
    const updatedName = this.updatetaskForm.get('name')?.value; // Obtenez le nom mis à jour à partir du formulaire
  
    const data = {
      id: task.id,
      name: updatedName
    };
  
    this.connexionService.updateTaskProName(task.id, data).subscribe((res: any) => {
      console.log(res); // Affichez la réponse du serveur
      // Mettez à jour localement le nom de la tâche avec le nom mis à jour
      task.name = updatedName;
      // Réinitialisez la valeur du champ du formulaire à vide
      this.getAllTasks();
    }, error => {
      console.error("Error updating task:", error); // Gérez les erreurs
      
    });
  }
  

  onUserSelect(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    // Utilisez selectedValue pour effectuer des opérations sur la valeur sélectionnée
  }
  
  
  showInput(task: any) {
    // Définit isEditing sur true pour afficher le champ de texte
    task.isEditing = true;
    // Initialise updatedName avec le nom actuel de la tâche
    task.updatedName = task.name;
  }

}