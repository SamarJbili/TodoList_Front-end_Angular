import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnexionService {
 
  constructor(private http: HttpClient) { }

  GetAllStaff(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/staff/');
  }
  GetStaff(): Observable<any[]> {
    return this.http.get<any[]>('http://127.0.0.1:8000/staff/').pipe(
        map(staff => staff.filter(employee => employee.type !== 'super admin'))
    );
}
getUserEmailById(userId: number): Observable<string | undefined> {
  return this.GetAllStaff().pipe(
    map((staff: any[]) => {
      const user = staff.find(employee => employee.id === userId && employee.type === 'user');
      return user ? user.mail : undefined;
    })
  );
}
  GetAllUser(): Observable<string[]> {
    return this.GetAllStaff().pipe(
      map((staff: any[]) => staff.filter(s => s.type === 'user').map(user => user.mail))
    );
    
  }

  authenticate(email: string, password: string): Observable<any | boolean> {
    return this.GetAllStaff().pipe(
      map((staff: any[]) => {
        const user = staff.find(s => s.mail === email && s.password === password);
        if (user) {
          let userData: any = { type: user.type, mail: user.mail };
          if (user.id) {
            userData.id = user.id;
          }
          return userData;
        } else {
          throw new Error('Authentification échouée');
        }
      })
    );
}



  Add(data: object) {
    return this.http.post('http://127.0.0.1:8000/staff/', data);
  }

  updateUserType(userid:number,userMail:object, type: String,password:object){
    const updatedUser = { mail:userMail, type: type ,password:password};
    return this.http.put('http://127.0.0.1:8000/staff/'+userid, updatedUser);
  }

  AddProject(data:object) {
    return this.http.post('http://127.0.0.1:8000/projects/', data);
  }
  
  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/projects/`);
  }
  DeleteProject(id: number) {
    return this.http.delete(`http://127.0.0.1:8000/projects/${id}`);
  }
  AddTasks(projectId: number, data: object): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/tasksPers/`, { ...data, projectID: projectId });
}
  AddTaskPro(projectId: number, data: object): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/tasksPro/`, { ...data, projectID: projectId });
  
}
getAllTasksPro(){
  return this.http.get<any[]>(`http://127.0.0.1:8000/tasksPro/`);
}
updateprojectName(id:number ,data:any){
  return this.http.put('http://127.0.0.1:8000/projects/'+id , data);
}
getUserTasksByEmail(email: string): Observable<any[]> {
  return this.http.get<any[]>(`http://127.0.0.1:8000/tasksPro?email=${email}`);
}



  getAllTasksPers(){
    return this.http.get<any[]>('http://127.0.0.1:8000/tasksPers/');
  }

  DeleteTasksPers(id: number) {
    return this.http.delete(`http://127.0.0.1:8000/tasksPers/${id}`);
  }
  DeleteTasksPro(id: number) {
    return this.http.delete(`http://127.0.0.1:8000/tasksPro/${id}`);
  }
  updateTaskCompletion(taskId: number, data:object): Observable<any> {
    
    return this.http.put<any>('http://127.0.0.1:8000/tasksPers/' + taskId, data);
  }
  updateTaskComp(taskId: number, data:object): Observable<any> {
    
    return this.http.put<any>('http://127.0.0.1:8000/tasksPro/' + taskId, data);
  }
  
  updateTaskName(id:number ,data:any){
    return this.http.put('http://127.0.0.1:8000/tasksPers/'+id , data);
  }
  updateTaskProName(id:number ,data:any){
    return this.http.put('http://127.0.0.1:8000/tasksPro/'+id , data);
  }
 

  getUserEmail(): string | null {
    return localStorage.getItem('mail');
  }
 


  getProjectTasks(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/tasksPers/?projectID=${projectId}`);
  }

  getAssignedProfessionalProjects(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/staff/${userId}/projects`);
  }
  getUserTasks(staffId: any): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/tasks/?staffId=${staffId}`);
  }
   
  getCompte(){
    return this.http.get<any[]>(`http://127.0.0.1:8000/comptes/`);
  }
  updateCompte(id:number,data:object){
    return this.http.put<any[]>(`http://127.0.0.1:8000/comptes/`+id ,data);
  }
  addCompte(data:object){
    return this.http.post<any[]>(`http://127.0.0.1:8000/comptes/`,data);
  }
  createCompte(StaffId: number, compteData: object): Observable<any> {
    return this.http.post<any>(`http://127.0.0.1:8000/comptes/`, { ...compteData, StaffID: StaffId });
  }
  

}

