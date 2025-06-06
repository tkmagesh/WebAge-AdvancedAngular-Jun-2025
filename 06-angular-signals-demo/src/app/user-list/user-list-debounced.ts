// user-search.component.ts
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserServiceDebounced } from '../user-service-debounced';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-search',
    imports: [ReactiveFormsModule],
    template: `
    <input
      type="text"
      [formControl]="searchControl"
      placeholder="Search users..."
    />
    @if (userService.loading()) {
    <div>Loading users...</div>
  }
  @if (userService.error()) {
    <div>{{ userService.error() }}</div>
  }
    <ul>
      @for (user of userService.users(); track user.name) {
        <li >{{ user.name }}</li>
      }
    </ul>
  `
})
export class UserSearchComponent implements OnDestroy {
    searchControl = new FormControl('');
    private sub: Subscription;

    constructor(public userService: UserServiceDebounced) {
        this.sub = this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                this.userService.setSearchTerm(value!.trim());
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
