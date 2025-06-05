import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { reduce, take } from 'rxjs/operators';

@Component({
  selector: 'app-reduce',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Reduce Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>reduce</code> operator applies an accumulator function over the source Observable and returns the accumulated result when the source completes.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Calculating totals and sums</li>
          <li>Finding min/max values</li>
          <li>Aggregating data</li>
          <li>Building final results from streams</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(reduce((acc, value) => acc + value, initialValue))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Sum Calculation</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>Source Values</h4>
            <div class="values">
              <div *ngFor="let value of sourceValues" class="value source">
                {{ value }}
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Reduce Result (Sum)</h4>
            <div class="values">
              <div *ngIf="!isCompleted && isRunning" class="value processing">
                Processing... ({{ sourceValues.length }} values so far)
              </div>
              <div *ngIf="reduceResult !== null" class="value reduce-result">
                Final Sum: {{ reduceResult }}
              </div>
              <div *ngIf="isCompleted" class="completion-notice">
                ✓ Stream Completed - Result Emitted
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

    .value.source {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .value.processing {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      font-style: italic;
    }

    .value.reduce-result {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
      font-weight: bold;
      font-size: 16px;
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
export class ReduceComponent implements OnInit, OnDestroy {
  sourceValues: number[] = [];
  reduceResult: number | null = null;
  isRunning = false;
  isCompleted = false;
  private sourceSubscription?: Subscription;
  private reduceSubscription?: Subscription;

  codeExample = `import { of } from 'rxjs';
import { reduce } from 'rxjs/operators';

// Source that emits: 1, 2, 3, 4, 5
const numbers$ = of(1, 2, 3, 4, 5);

// Calculate sum using reduce
const sum$ = numbers$.pipe(
  reduce((acc, value) => acc + value, 0)
);

sum$.subscribe(result => {
  console.log('Sum:', result); // Output: Sum: 15
});

// Find maximum value
const max$ = numbers$.pipe(
  reduce((acc, value) => Math.max(acc, value), -Infinity)
);

max$.subscribe(result => {
  console.log('Max:', result); // Output: Max: 5
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;
    this.isCompleted = false;

    const source$ = interval(800).pipe(
      take(6),
      // Generate values: 1, 2, 3, 4, 5, 6
    );

    // Subscribe to source to show individual values
    this.sourceSubscription = source$.subscribe(value => {
      const sourceValue = value + 1;
      this.sourceValues.push(sourceValue);
    });

    // Subscribe to reduce to get final sum
    this.reduceSubscription = source$.pipe(
      reduce((acc, value) => acc + (value + 1), 0)
    ).subscribe({
      next: result => {
        this.reduceResult = result;
      },
      complete: () => {
        this.isCompleted = true;
        this.isRunning = false;
      }
    });
  }

  stopDemo() {
    if (this.sourceSubscription) {
      this.sourceSubscription.unsubscribe();
      this.sourceSubscription = undefined;
    }
    if (this.reduceSubscription) {
      this.reduceSubscription.unsubscribe();
      this.reduceSubscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.sourceValues = [];
    this.reduceResult = null;
    this.isCompleted = false;
  }
}
