import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, of, throwError, Subscription } from 'rxjs';
import { retry, map, take, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Retry Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>retry</code> operator resubscribes to the source Observable when an error occurs, up to a specified number of times.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Network request retries</li>
          <li>Handling temporary failures</li>
          <li>Resilient API calls</li>
          <li>Connection recovery</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(retry(count))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - API Retry Simulation</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>Attempts</h4>
            <div class="values">
              <div *ngFor="let attempt of attempts" 
                   class="value" 
                   [ngClass]="{'success': attempt.success, 'error': !attempt.success, 'retry': attempt.isRetry}">
                {{ attempt.message }}
                <span *ngIf="attempt.isRetry" class="status retry">RETRY</span>
                <span *ngIf="!attempt.success && !attempt.isRetry" class="status error">ERROR</span>
                <span *ngIf="attempt.success" class="status success">SUCCESS</span>
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Final Result</h4>
            <div class="values">
              <div *ngFor="let result of finalResults" 
                   class="value" 
                   [ngClass]="{'final-success': result.includes('Success'), 'final-error': result.includes('Failed')}">
                {{ result }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-example">
        <h3>Code Example</h3>
        <pre><code>{{ codeExample }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .operator-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .operator-info {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .demo-section {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .demo-controls {
      margin-bottom: 20px;
    }

    .demo-controls button {
      margin-right: 10px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }

    .demo-controls button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .results {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-top: 20px;
    }

    .result-column {
      flex: 1;
    }

    .arrow {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      align-self: center;
    }

    .values {
      min-height: 150px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
    }

    .value {
      padding: 5px 10px;
      margin: 5px 0;
      border-radius: 4px;
      animation: fadeIn 0.3s ease-in;
      position: relative;
    }

    .value.success {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.error {
      background: #ffebee;
      border-left: 4px solid #f44336;
    }

    .value.retry {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .value.final-success {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
      font-weight: bold;
    }

    .value.final-error {
      background: #ffebee;
      border-left: 4px solid #f44336;
      font-weight: bold;
    }

    .status {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 10px;
      font-weight: bold;
      color: white;
    }

    .status.retry {
      background: #ff9800;
    }

    .status.error {
      background: #f44336;
    }

    .status.success {
      background: #4caf50;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .code-example {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }

    .code-example pre {
      background: #2d3748;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }

    h2 {
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    h3, h4 {
      color: #555;
      margin-top: 20px;
    }

    code {
       
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 5px;
    }
  `]
})
export class RetryComponent implements OnInit, OnDestroy {
  attempts: Array<{message: string, success: boolean, isRetry: boolean}> = [];
  finalResults: string[] = [];
  isRunning = false;
  private subscription?: Subscription;
  private attemptCount = 0;

  codeExample = `import { of, throwError } from 'rxjs';
import { retry, mergeMap } from 'rxjs/operators';

// Simulate unreliable API call
function unreliableApiCall() {
  const shouldFail = Math.random() < 0.7; // 70% failure rate
  
  if (shouldFail) {
    return throwError(() => new Error('Network error'));
  }
  
  return of('API Success!');
}

// Use retry to handle failures
const apiWithRetry$ = unreliableApiCall().pipe(
  retry(3) // Retry up to 3 times
);

apiWithRetry$.subscribe({
  next: result => console.log('Result:', result),
  error: error => console.log('Final error after retries:', error.message)
});

// Will retry automatically on failure up to 3 times`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;
    this.attemptCount = 0;

    // Simulate unreliable API call
    const unreliableApi = () => {
      this.attemptCount++;
      const shouldFail = this.attemptCount <= 2; // Fail first 2 attempts, succeed on 3rd
      
      this.attempts.push({
        message: `Attempt ${this.attemptCount}`,
        success: !shouldFail,
        isRetry: this.attemptCount > 1
      });

      if (shouldFail) {
        return throwError(() => new Error('Network error'));
      }
      
      return of('API Success!');
    };

    this.subscription = unreliableApi().pipe(
      retry(3) // Retry up to 3 times
    ).subscribe({
      next: result => {
        this.finalResults.push(`Success: ${result}`);
        this.isRunning = false;
      },
      error: error => {
        this.finalResults.push(`Failed after retries: ${error.message}`);
        this.isRunning = false;
      }
    });
  }

  stopDemo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.attempts = [];
    this.finalResults = [];
    this.attemptCount = 0;
  }
}
