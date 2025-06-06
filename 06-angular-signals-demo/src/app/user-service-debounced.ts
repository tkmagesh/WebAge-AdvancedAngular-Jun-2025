
import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, finalize } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserServiceDebounced {
    private _searchTerm = signal('');
    private _loading = signal(false);
    private _error = signal<string | null>(null);
    private _users = signal<any[]>([]);
    private _cache = new Map<string, any[]>();

    searchTerm = this._searchTerm.asReadonly();
    loading = this._loading.asReadonly();
    error = this._error.asReadonly();
    users = this._users.asReadonly();

    constructor(private http: HttpClient) {
        // Effect: search on searchTerm change
        effect(() => {
            const query = this._searchTerm();
            if (query.length < 2) {
                this._users.set([]);
                return;
            }

            // Check cache
            if (this._cache.has(query)) {
                this._users.set(this._cache.get(query)!);
                return;
            }

            this._loading.set(true);
            this._error.set(null);

            this.http.get<any[]>('http://localhost:3000/api/users', {
                params: { search: query }
            })
                .pipe(
                    catchError(err => {
                        this._error.set('Failed to load users.');
                        return of([]);
                    }),
                    finalize(() => this._loading.set(false))
                )
                .subscribe(users => {
                    this._cache.set(query, users);
                    this._users.set(users);
                });
        });
    }

    setSearchTerm(term: string) {
        this._searchTerm.set(term);
    }
}
