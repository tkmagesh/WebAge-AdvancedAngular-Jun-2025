import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, of, Subscription } from 'rxjs';
import { concatMap, take, delay } from 'rxjs/operators';

@Component({
  selector: 'app-concat-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>ConcatMap Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>concatMap</code> operator maps each source value to an Observable, then flattens all inner Observables sequentially (waits for each to complete before starting the next).</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Sequential HTTP requests</li>
          <li>Ordered processing</li>
          <li>File uploads in sequence</li>
          <li>Database transactions</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(concatMap(value => innerObservable))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Sequential API Calls</h3>
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
                Request {{ value }}
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>ConcatMap Results (Sequential)</h4>
            <div class="values">
              <div *ngFor="let result of concatMapResults; let i = index" class="value concat">
                {{ result }}
                <span class="timing">{{ getTimestamp(i) }}</span>
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
      background: #e1f5fe;
      border-left: 4px solid #0288d1;
    }

    .value.concat {
      background: #f3e5f5;
      border-left: 4px solid #8e24aa;
    }

    .timing {
      font-size: 10px;
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
export class ConcatMapComponent implements OnInit, OnDestroy {
  sourceValues: number[] = [];
  concatMapResults: string[] = [];
  isRunning = false;
  private subscription?: Subscription;
  private startTime = 0;
  private resultTimestamps: number[] = [];

  codeExample = `import { interval, of } from 'rxjs';
import { concatMap, take, delay } from 'rxjs/operators';

// Source that emits requests
const source$ = interval(500).pipe(take(3));

// Use concatMap for sequential processing
const sequential$ = source$.pipe(
  concatMap(value => 
    of(\`Response for request \${value}\`).pipe(
      delay(1000) // Simulate API delay
    )
  )
);

sequential$.subscribe(result => {
  console.log('Result:', result);
});

// Results come in order, waiting for each to complete:
// Response for request 0 (after 1000ms)
// Response for request 1 (after 2000ms) 
// Response for request 2 (after 3000ms)`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;
    this.startTime = Date.now();

    const source$ = interval(800).pipe(take(3));
    
    this.subscription = source$.pipe(
      concatMap(value => {
        this.sourceValues.push(value);
        
        // Simulate API call with varying delays
        const delay_ms = 1500 + (value * 200); // Increasing delay
        return of(`Response for request ${value}`).pipe(
          delay(delay_ms)
        );
      })
    ).subscribe(result => {
      this.concatMapResults.push(result);
      this.resultTimestamps.push(Date.now() - this.startTime);
    });

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 8000);
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
    this.concatMapResults = [];
    this.resultTimestamps = [];
  }

  getTimestamp(index: number): string {
    if (this.resultTimestamps[index]) {
      return `+${Math.round(this.resultTimestamps[index] / 100) / 10}s`;
    }
    return '';
  }
}
