import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, of, Subscription } from 'rxjs';
import { mergeMap, take, delay } from 'rxjs/operators';

@Component({
  selector: 'app-merge-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>MergeMap Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>mergeMap</code> operator maps each source value to an Observable, then flattens all inner Observables into a single output Observable.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>HTTP requests that can run in parallel</li>
          <li>Flattening nested observables</li>
          <li>Handling multiple async operations simultaneously</li>
          <li>Real-time data processing</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(mergeMap(value => innerObservable))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Parallel HTTP-like Requests</h3>
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
            <h4>MergeMap Results</h4>
            <div class="values">
              <div *ngFor="let result of mergeMapResults" class="value merged">
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
      min-height: 100px;
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
      background: #e1f5fe;
      border-left: 4px solid #0288d1;
    }

    .value.merged {
      background: #f3e5f5;
      border-left: 4px solid #8e24aa;
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

    h3 {
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
export class MergeMapComponent implements OnInit, OnDestroy {
  sourceValues: number[] = [];
  mergeMapResults: string[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { interval, of } from 'rxjs';
import { mergeMap, take, delay } from 'rxjs/operators';

// Create a source observable
const source$ = interval(1000).pipe(take(3));

// Use mergeMap to create parallel inner observables
const merged$ = source$.pipe(
  mergeMap(value => 
    of(\`Response for request \${value}\`).pipe(
      delay(Math.random() * 2000) // Simulate varying response times
    )
  )
);

// Subscribe to see results as they complete
merged$.subscribe(result => {
  console.log('Result:', result);
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    const source$ = interval(1000).pipe(take(3));
    
    this.subscription = source$.pipe(
      mergeMap(value => {
        this.sourceValues.push(value);
        
        // Simulate HTTP request with random delay
        const delay_ms = Math.random() * 2000 + 500;
        return of(`Response for request ${value}`).pipe(
          delay(delay_ms)
        );
      })
    ).subscribe(result => {
      this.mergeMapResults.push(result);
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
    this.sourceValues = [];
    this.mergeMapResults = [];
  }
}
