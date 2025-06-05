import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>Filter Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>filter</code> operator emits only those values from the source that satisfy a specified condition.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Remove unwanted values from a stream</li>
          <li>Validate data before processing</li>
          <li>Filter based on user input or conditions</li>
          <li>Remove null or undefined values</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(filter(value => condition))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Filter Even Numbers</h3>
        <div class="demo-controls">
          <button (click)="startDemo()" [disabled]="isRunning">Start Demo</button>
          <button (click)="stopDemo()" [disabled]="!isRunning">Stop Demo</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>All Values</h4>
            <div class="values">
              <div *ngFor="let value of allValues" class="value all">
                {{ value }}
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Filtered Values (Even Only)</h4>
            <div class="values">
              <div *ngFor="let value of filteredValues" class="value filtered">
                {{ value }}
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

    .value.all {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
    }

    .value.filtered {
      background: #d1ecf1;
      border-left: 4px solid #17a2b8;
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
export class FilterComponent implements OnInit, OnDestroy {
  allValues: number[] = [];
  filteredValues: number[] = [];
  isRunning = false;
  private subscription?: Subscription;

  codeExample = `import { interval } from 'rxjs';
import { filter, take } from 'rxjs/operators';

// Create a source observable that emits numbers
const source$ = interval(800).pipe(take(10));

// Apply filter operator to keep only even numbers
const filtered$ = source$.pipe(
  filter(value => value % 2 === 0)
);

// Subscribe to see the results
filtered$.subscribe(value => {
  console.log('Filtered value:', value);
});`;

  ngOnInit() {}

  ngOnDestroy() {
    this.stopDemo();
  }

  startDemo() {
    this.clearResults();
    this.isRunning = true;

    const source$ = interval(800).pipe(take(10));
    
    this.subscription = source$.subscribe(value => {
      this.allValues.push(value);
      
      // Apply filter condition (even numbers only)
      if (value % 2 === 0) {
        this.filteredValues.push(value);
      }
    });

    // Stop demo after completion
    setTimeout(() => {
      this.isRunning = false;
    }, 9000);
  }

  stopDemo() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.isRunning = false;
  }

  clearResults() {
    this.allValues = [];
    this.filteredValues = [];
  }
}
