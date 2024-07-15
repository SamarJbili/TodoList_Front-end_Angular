import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConnexionService } from '../Service/connexion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajouttaches',
  templateUrl: './ajouttaches.component.html',
  styleUrls: ['./ajouttaches.component.css']
})
export class AjouttachesComponent {
  updatetaskForm!:FormGroup;
  addtaskForm!: FormGroup;
  tasks: any[] = [];
  completedTasks: any[] = [];
  incompletedTasks: any[] = [];
  projectId: number | null = null; // Stocker l'ID du projet
  constructor(private connexionService: ConnexionService,private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.addtaskForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
    this.updatetaskForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
    this.getAllTasks();  
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.projectId = id ? +id : null; // Convertir l'ID en nombre ou le laisser null
    });
  
  }
  
  taskId!:number;
  markAllChecked: boolean = false;
  task!:any;
  
  handleMarkAllTasks(event: any) {
    this.markAllChecked = event.target.checked;
  }

  generateTaskId(): string {
   
    return 'task-' + Date.now();
  }

  getAllTasks() {
    this.connexionService.getAllTasksPers().subscribe(res => {
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
  if (this.projectId !== null) {
    console.log(this.addtaskForm.value);

   
    const taskData = {
      ...this.addtaskForm.value,
      completed: false,
      projectId: this.projectId
    };

    this.connexionService.AddTasks(this.projectId, taskData).subscribe((res: any) => {
      console.log(res);

      this.addtaskForm.reset();
      this.getAllTasks();
  }, error => {
      console.error("Error adding task:", error);
  });
  
  } else {
    console.error("Project ID is null");
  }
}

  deleteTask(id: number) {
    this.connexionService.DeleteTasksPers(id).subscribe((res: any) => {
      console.log("🚀 ~ AjouttachesComponent ~ this.connexionService.DeleteTasksPers ~ res :", res);

     
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        
        this.tasks.splice(index, 1);
        
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

  updateTaskCompletion(task: any, event: any) {
    const taskId = task.id;
    const newCompletedValue = event.target.checked;
    const data = { completed: newCompletedValue ,name:task.name,data:task.date,id:taskId}; // Créer un objet avec la nouvelle valeur de complétion
    
    this.connexionService.updateTaskCompletion(taskId, data)
      .subscribe((res: any) => {
        // Mettre à jour la valeur completed de la tâche localement si nécessaire
        task.completed = newCompletedValue;
        
        console.log("Task updated successfully:", res);
      }, error => {
        console.error("Error updating task:", error);
      });
  }
  
  getCompletedTasksCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }
  
  getIncompletedTasksCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  updateTaskName(task: any) {
    const updatedName = this.updatetaskForm.get('name')?.value; 
  
    const data = {
      id: task.id,
      name: updatedName
    };
  
    this.connexionService.updateTaskName(task.id, data).subscribe((res: any) => {
      console.log(res); 
      
      task.name = updatedName;
      
      this.getAllTasks();
    }, error => {
      console.error("Error updating task:", error);
      
    });
  }
  
  
 
  
  showInput(task: any) {
  
    task.isEditing = true;
   
    task.updatedName = task.name;
  }
}
