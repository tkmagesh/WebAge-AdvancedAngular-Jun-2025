import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-start-with',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>StartWith Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>startWith</code> operator emits specified values before the source observable begins emitting.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Providing initial/default values</li>
          <li>Loading states</li>
          <li>Default form values</li>
          <li>Prepending data to streams</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(startWith(value1, value2, ...))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Loading State</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>Source Stream</h4>
            <div class="values">
              <div *ngFor="let value of sourceValues" class="value source">
                {{ value }}
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>With StartWith</h4>
            <div class="values">
              <div *ngFor="let value of startWithValues; let i = index" 
                   class="value" 
                   [ngClass]="{'initial': i < 2, 'stream': i >= 2}">
                {{ value }}
                <span *ngIf="i < 2" class="status">INITIAL</span>
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

    .value.source {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .value.initial {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
    }

    .value.stream {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .status {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 10px;
      background: #ff9800;
      color: white;
      font-weight: bold;
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
export class StartWithComponent implements OnInit, OnDestroy {
  sourceValues: string[] = [];
  startWithValues: string[] = [];
  isRunning = false;
  private sourceSubscription?: Subscription;
  private startWithSubscription?: Subscription;

  codeExample = `import { interval, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// API data stream
const apiData$ = interval(2000).pipe(
  map(i => \`API Data \${i + 1}\`)
);

// Add loading state and initial values
const withInitialState$ = apiData$.pipe(
  startWith('Loading...', 'Connecting to server...')
);

withInitialState$.subscribe(value => {
  console.log('UI State:', value);
});

// Output:
// UI State: Loading...
// UI State: Connecting to server...
// UI State: API Data 1
// UI State: API Data 2
// ...`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    // Create source stream (simulating API data)
    const source$ = interval(1500).pipe(
      take(4),
      map(i => `API Data ${i + 1}`)
    );

    // Subscribe to source to show original values
    this.sourceSubscription = source$.subscribe(value => {
      this.sourceValues.push(value);
    });

    // Subscribe to startWith version
    this.startWithSubscription = source$.pipe(
      startWith('Loading...', 'Connecting to server...')
    ).subscribe(value => {
      this.startWithValues.push(value);
    });

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 8000);
  }

  stopDemo() {
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
      this.sourceSubscription = undefined;
    }
    if (this.startWithSubscription) {
      this.startWithSubscription.unsubscribe();
      this.startWithSubscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.sourceValues = [];
    this.startWithValues = [];
  }
}
