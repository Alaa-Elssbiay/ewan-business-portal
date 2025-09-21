import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginService } from 'src/app/demo/service/login.service';
import { MessageService } from 'primeng/api';

interface LoginResponse {
    token: string;
    user?: any;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    submitted = false;
    isLoading = false;

    private readonly destroy$ = new Subject<void>();

    constructor(
        public layoutService: LayoutService,
        private fb: FormBuilder,
        private loginService: LoginService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get f(): { [key: string]: AbstractControl } {
        return this.loginForm.controls;
    }

    private initForm(): void {
        this.loginForm = this.fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(255),
                ],
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(50),
                ],
            ],
        });
    }

    private resetForm(): void {
        this.submitted = false;
        this.loginForm.reset();
    }

    getFieldError(fieldName: string): string | null {
        const field = this.f[fieldName];
        if (!(this.submitted && field?.errors)) return null;

        if (field.errors['required'])
            return `${this.capitalize(fieldName)} is required.`;
        if (field.errors['email']) return 'Please enter a valid email address.';
        if (field.errors['minlength'])
            return `${this.capitalize(fieldName)} is too short.`;
        if (field.errors['maxlength'])
            return `${this.capitalize(fieldName)} is too long.`;

        return 'This field is invalid.';
    }

    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    login(): void {
        this.submitted = true;

        if (this.loginForm.invalid) {
            this.showValidationErrors();
            return;
        }

        this.doLogin();
    }

    onForgotPassword(): void {
        this.router.navigate(['/auth/forgot-password']);
    }

    private showValidationErrors(): void {
        const errors = Object.keys(this.f)
            .map((key) => this.getFieldError(key))
            .filter((msg): msg is string => !!msg);

        this.showErrorMessage(
            'Form Validation Error',
            errors.length > 1
                ? 'Please correct the form errors and try again.'
                : errors[0]!
        );
    }

    private doLogin(): void {
        const { email, password } = this.loginForm.value;
        this.isLoading = true;

        this.loginService
            .login(email, password)
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => (this.isLoading = false))
            )
            .subscribe({
                next: (res) => this.handleLoginSuccess(res),
                error: (err) => this.handleLoginError(err),
            });
    }

    private handleLoginSuccess(response: LoginResponse): void {
        localStorage.setItem('token', response.token);
        if (response.user)
            localStorage.setItem('user', JSON.stringify(response.user));

        this.showSuccessMessage(
            'Welcome back!',
            'You have been logged in successfully.'
        );
        this.resetForm();
        this.router.navigate(['/dashboard']);
    }

    private handleLoginError(error: any): void {
        console.error('Login error:', error);

        let errorMessage = 'An error occurred during login. Please try again.';

        switch (error?.status) {
            case 401:
                errorMessage = 'Invalid email or password.';
                break;
            case 403:
                errorMessage =
                    'Your account has been locked. Please contact support.';
                break;
            case 429:
                errorMessage =
                    'Too many login attempts. Please try again later.';
                break;
            default:
                if (error?.error?.message) errorMessage = error.error.message;
                else if (error?.message) errorMessage = error.message;
        }

        this.showErrorMessage('Login Failed', errorMessage);
    }

    private showSuccessMessage(summary: string, detail: string): void {
        this.messageService.add({
            severity: 'success',
            summary,
            detail,
            life: 5000,
        });
    }

    private showErrorMessage(summary: string, detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary,
            detail,
            life: 8000,
        });
    }
}
