import { Component, OnInit } from '@angular/core';
import { FormBuilder, formGroup, Validators } from '@angular/forms';
import { RouterExtensions } from '@nativescript/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  form: formGroup;
  isLogin = true;

  constructor(
    private formBuilder: FormBuilder,
    private AuthService: AuthService,
    private routerExtensions: RouterExtensions
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const { email, password } = this.form.value;
        if (this.isLogin) {
          await this.authService.login(email, password);
        } else {
          await this.authService.register(email, password);
        }
        this.routerExtensions.navigate(['/home'], { clearHistory: true });
      } catch (error) {
        console.error('Authentication error:', error);
        alert('Error de autenticación: ' + error.message);
      }
    }
  }
}