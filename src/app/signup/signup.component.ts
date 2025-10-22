import { CommonModule } from '@angular/common';
import { HttpClient , HttpClientModule} from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
signupForm:FormGroup;
roles:string[]=['User'];
submitted=false;
  constructor(private fb: FormBuilder, private http:HttpClient) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email  : ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required, Validators.minLength(6)]],
      conpassword: ['', Validators.required],
       role: ['',Validators.required] 
    }, { validator: this.passwordMatchValidator });
  }
 passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('conpassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
}
   onSubmit() {

    if (this.signupForm.valid) {
     
      console.log('Form Data:', this.signupForm.value);
      this.http.post('https://localhost:5000/api/Signup',this.signupForm.value)
       .subscribe({
        next: (res:any) => {
          console.log('Post created:', res);
          alert('Sign up submitted successfully!');
         this.signupForm.reset();
                   // (optional) Mark form as untouched and pristine again
          this.signupForm.markAsPristine();
          this.signupForm.markAsUntouched();

        },
        error: (err:any) => console.error(err)
      });
    }
}
}
