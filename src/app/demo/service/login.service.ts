import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private readonly defaultUser = {
        email: 'test@example.com',
        password: '123456',
        token: 'dummy-token-123456',
    };

    constructor() {}

    login(email: string, password: string): Observable<any> {
        if (
            email === this.defaultUser.email &&
            password === this.defaultUser.password
        ) {
            return of({ token: this.defaultUser.token }).pipe(delay(500));
        } else {
            return throwError(() => new Error('Invalid credentials')).pipe(
                delay(500)
            );
        }
    }
}
