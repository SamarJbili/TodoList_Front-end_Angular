import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConnexionService } from '../Service/connexion.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  adminForm!: FormGroup;
  users: any[] = [];

  constructor(private formBuilder: FormBuilder, private connexionService: ConnexionService) {}

  ngOnInit(): void {
    this.adminForm = new FormGroup({
      userType: new FormControl(false),
      adminType: new FormControl(false)
    });

    this.loadUsers();
  }

  loadUsers() {
    this.connexionService.GetStaff().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('An error occurred while loading users: ', error);
      }
    );
  }

  toggleEditMode(user: any) {
    user.editMode = !user.editMode;
    
  }
  handleCheckboxChange(user: any) {
    if (user.editMode) {
      if (this.adminForm.get('userType')?.value) {
        this.adminForm.get('adminType')?.setValue(false);
      } else if (this.adminForm.get('adminType')?.value) {
        this.adminForm.get('userType')?.setValue(false);
      }
    }
  }

  updateUserType(user: any) {
    const userType = this.adminForm.value.userType;
    const adminType = this.adminForm.value.adminType;
  
    if (!userType && !adminType) {
      alert('Please select at least one user type.');
      return;
    }
    
    if (userType) {
      user.type = 'user';
    }
    if (adminType) {
      user.type = 'admin';
    }
  
    this.connexionService.updateUserType(user.id, user.mail,user.type,user.password).subscribe(
      () => {
        console.log('User type updated successfully.');
        this.loadUsers();
      },
      (error) => {
        console.error('An error occurred while updating user type: ', error);
      }
    );
  }
  
  
  
  
}
