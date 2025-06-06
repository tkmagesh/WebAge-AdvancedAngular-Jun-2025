import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal, effect } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = signal<any[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  constructor(private http: HttpClient) { }

  fetchUsers() {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<any[]>('http://localhost:3000/api/users')
      .pipe(
        catchError(err => {
          this._error.set('Failed to load users.');
          return of([]);
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(users => {
        this._users.set(users);
      });
  }
}

