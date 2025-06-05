import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, of, throwError, Subscription } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-catch-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>CatchError Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>catchError</code> operator catches errors on the observable and returns a new observable or throws an error.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>HTTP error handling</li>
          <li>Fallback values</li>
          <li>Error recovery</li>
          <li>Graceful degradation</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(catchError(error => fallbackObservable))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - API Error Simulation</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>API Calls</h4>
            <div class="values">
              <div *ngFor="let call of apiCalls" 
                   class="value" 
                   [ngClass]="{'success': call.success, 'error': !call.success}">
                {{ call.message }}
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Final Results (with Error Handling)</h4>
            <div class="values">
              <div *ngFor="let result of finalResults" 
                   class="value" 
                   [ngClass]="{'recovered': result.includes('fallback'), 'normal': !result.includes('fallback')}">
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
    }

    .value.success {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.error {
      background: #ffebee;
      border-left: 4px solid #f44336;
    }

    .value.normal {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .value.recovered {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
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
export class CatchErrorComponent implements OnInit, OnDestroy {
  apiCalls: Array<{message: string, success: boolean}> = [];
  finalResults: string[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Simulate API call that might fail
function apiCall(id: number) {
  if (id === 3) {
    return throwError(() => new Error('API Error: Server unavailable'));
  }
  return of(\`Data for ID: \${id}\`);
}

// Handle errors gracefully
const result$ = apiCall(3).pipe(
  catchError(error => {
    console.error('Caught error:', error.message);
    
    // Return fallback value
    return of('Fallback data from cache');
    
    // Or re-throw with custom error
    // return throwError(() => new Error('Custom error'));
  })
);

result$.subscribe({
  next: data => console.log('Received:', data),
  error: err => console.error('Final error:', err)
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    const source$ = interval(1000).pipe(
      take(5),
      map(value => {
        // Simulate API call that fails on value 2
        if (value === 2) {
          this.apiCalls.push({
            message: `API Call ${value}: ERROR - Server unavailable`,
            success: false
          });
          return throwError(() => new Error('Server unavailable'));
        } else {
          this.apiCalls.push({
            message: `API Call ${value}: SUCCESS`,
            success: true
          });
          return of(`Data for request ${value}`);
        }
      }),
      // Flatten the inner observables and handle errors
      map(obs => obs.pipe(
        catchError(error => {
          console.error('Caught error:', error.message);
          return of(`Fallback data for failed request`);
        })
      ))
    );

    this.subscription = source$.subscribe(innerObs => {
      innerObs.subscribe(result => {
        this.finalResults.push(result);
      });
    });

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 6000);
  }

  stopDemo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.apiCalls = [];
    this.finalResults = [];
  }
}
