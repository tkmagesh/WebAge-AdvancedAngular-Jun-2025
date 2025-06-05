import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { scan, take } from 'rxjs/operators';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Scan Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>scan</code> operator applies an accumulator function over the source Observable and returns each intermediate result.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Running totals and counters</li>
          <li>State management</li>
          <li>Accumulating values over time</li>
          <li>Building up complex objects</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(scan((acc, value) => acc + value, initialValue))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Running Sum</h3>
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
            <h4>Running Sum (Scan)</h4>
            <div class="values">
              <div *ngFor="let value of scanResults; let i = index" class="value scan">
                {{ value }}
                <span class="calculation">{{ getCalculation(i) }}</span>
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

    .value.scan {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .calculation {
      font-size: 11px;
      color: #666;
      margin-left: 10px;
      font-style: italic;
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
export class ScanComponent implements OnInit, OnDestroy {
  sourceValues: number[] = [];
  scanResults: number[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { interval } from 'rxjs';
import { scan, take } from 'rxjs/operators';

// Source that emits: 1, 2, 3, 4, 5
const source$ = interval(1000).pipe(
  take(5),
  map(x => x + 1)
);

// Calculate running sum
const runningSum$ = source$.pipe(
  scan((acc, value) => acc + value, 0)
);

runningSum$.subscribe(sum => {
  console.log('Running sum:', sum);
});

// Output:
// Running sum: 1  (0 + 1)
// Running sum: 3  (1 + 2)  
// Running sum: 6  (3 + 3)
// Running sum: 10 (6 + 4)
// Running sum: 15 (10 + 5)`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    const source$ = interval(1000).pipe(
      take(6),
      // Generate values: 1, 2, 3, 4, 5, 6
    );

    // Track source values
    source$.subscribe(value => {
      const sourceValue = value + 1;
      this.sourceValues.push(sourceValue);
    });

    // Calculate running sum using scan
    this.subscription = source$.pipe(
      scan((acc, value) => acc + (value + 1), 0)
    ).subscribe(sum => {
      this.scanResults.push(sum);
    });

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 7000);
  }

  stopDemo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.sourceValues = [];
    this.scanResults = [];
  }

  getCalculation(index: number): string {
    if (index === 0) {
      return `(0 + ${this.sourceValues[0]})`;
    }
    return `(${this.scanResults[index - 1]} + ${this.sourceValues[index]})`;
  }
}
