import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Join Chat Room</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Enter your username:</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="username"
              required
              minlength="2"
              maxlength="20"
              placeholder="Your username"
              #usernameInput="ngModel"
              autocomplete="off"
            />
            @if (usernameInput.invalid && usernameInput.touched) {
              <div class="error-message">
                @if (usernameInput.errors?.['required']) {
                  <span>Username is required</span>
                }
                @if (usernameInput.errors?.['minlength']) {
                  <span>Username must be at least 2 characters</span>
                }
                @if (usernameInput.errors?.['maxlength']) {
                  <span>Username must be less than 20 characters</span>
                }
              </div>
            }
          </div>
          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="join-button"
          >
            {{ isLoading ? 'Joining...' : 'Join Chat' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    input.ng-invalid.ng-touched {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .join-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .join-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .join-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .join-button:active:not(:disabled) {
      transform: translateY(0);
    }
  `]
})
export class LoginComponent {
  @Output() userJoined = new EventEmitter<string>();
  
  username: string = '';
  isLoading: boolean = false;

  onSubmit(): void {
    if (this.username.trim() && !this.isLoading) {
      this.isLoading = true;
      
      // Simulate a brief loading state
      setTimeout(() => {
        this.userJoined.emit(this.username.trim());
        this.isLoading = false;
      }, 500);
    }
  }
}
