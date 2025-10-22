import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { decode } from 'punycode';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 loginForm:FormGroup;
 submitted=false;

constructor(private fb: FormBuilder, private http: HttpClient,private router:Router) { 

  this.loginForm=this.fb.group({
   email:['',[Validators.required,Validators.email]],
   password:['',[Validators.required,Validators.minLength(6)]]
  });
 }
 get f(){return this.loginForm.controls;}
 onSubmit(){
  if (this.loginForm.valid) {
    
      this.http.post('https://localhost:5000/api/Login/login', this.loginForm.value)
        .subscribe({
          next: (res: any) => {
            console.log('Login success:', res);
            alert('Login successful!');
            localStorage.setItem("JwtToken", res.token);
               localStorage.setItem("userId", res.user);
               localStorage.setItem("username", res.name);
                localStorage.setItem('role', res.role); 
                const decoded: any = jwtDecode(res.token);
            localStorage.setItem("email", decoded.email);
             this.router.navigate([""]);
          },
          error: (err) => {
          console.error('Login failed:', err);
          // Show backend message if available
          if (err.error && err.error.message) {
            alert(err.error.message);
          } else {
            alert('An error occurred. Please try again.');
          }
        }
      });
    }
  }
}
