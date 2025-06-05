import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-take',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Take Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>take</code> operator emits only the first n values emitted by the source Observable, then completes.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Limiting the number of emissions</li>
          <li>Taking first few items from a list</li>
          <li>Sampling data streams</li>
          <li>Preventing infinite subscriptions</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(take(count))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Take First 5 Values</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>Source Stream (Infinite)</h4>
            <div class="values">
              <div *ngFor="let value of sourceValues; let i = index" 
                   class="value" 
                   [ngClass]="{'taken': i < 5, 'ignored': i >= 5}">
                {{ value }}
                <span *ngIf="i >= 5" class="status">IGNORED</span>
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Take(5) Output</h4>
            <div class="values">
              <div *ngFor="let value of takenValues" class="value taken-output">
                {{ value }}
              </div>
              <div *ngIf="isCompleted" class="completion-notice">
                ✓ Observable Completed
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

    .value.taken {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.ignored {
      background: #ffebee;
      border-left: 4px solid #f44336;
      opacity: 0.6;
    }

    .value.taken-output {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .status {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 10px;
      background: #f44336;
      color: white;
      font-weight: bold;
    }

    .completion-notice {
      background: #4caf50;
      color: white;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      margin-top: 10px;
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
export class TakeComponent implements OnInit, OnDestroy {
  sourceValues: number[] = [];
  takenValues: number[] = [];
  isRunning = false;
  isCompleted = false;
  private sourceSubscription?: Subscription;
  private takeSubscription?: Subscription;

  codeExample = `import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

// Create an infinite stream
const source$ = interval(1000);

// Take only the first 5 values
const taken$ = source$.pipe(
  take(5)
);

taken$.subscribe({
  next: value => console.log('Taken value:', value),
  complete: () => console.log('Observable completed!')
});

// Output: 0, 1, 2, 3, 4, then completes`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;
    this.isCompleted = false;

    // Create source stream
    const source$ = interval(800);
    
    // Subscribe to source to show all values
    this.sourceSubscription = source$.subscribe(value => {
      this.sourceValues.push(value);
    });

    // Subscribe to take(5) to show limited values
    this.takeSubscription = source$.pipe(
      take(5)
    ).subscribe({
      next: value => {
        this.takenValues.push(value);
      },
      complete: () => {
        this.isCompleted = true;
        this.isRunning = false;
      }
    });

    // Stop source after 10 seconds to prevent infinite growth
    setTimeout(() => {
      if (this.sourceSubscription) {
        this.sourceSubscription.unsubscribe();
      }
    }, 10000);
  }

  stopDemo() {
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
      this.sourceSubscription = undefined;
    }
    if (this.takeSubscription) {
      this.takeSubscription.unsubscribe();
      this.takeSubscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.sourceValues = [];
    this.takenValues = [];
    this.isCompleted = false;
  }
}
