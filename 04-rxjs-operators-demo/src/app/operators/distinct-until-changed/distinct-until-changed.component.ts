import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-distinct-until-changed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>DistinctUntilChanged Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>distinctUntilChanged</code> operator emits only when the current value is different from the previous value.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Preventing duplicate consecutive values</li>
          <li>Form input optimization</li>
          <li>State change detection</li>
          <li>Reducing unnecessary API calls</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(distinctUntilChanged())</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Remove Consecutive Duplicates</h3>
        <div class="demo-controls">
          <button (click)="simulateValues()" [disabled]="isRunning">Simulate Values</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>All Values (with duplicates)</h4>
            <div class="values">
              <div *ngFor="let value of allValues; let i = index" 
                   class="value" 
                   [ngClass]="{'duplicate': isDuplicate(i), 'unique': !isDuplicate(i)}">
                {{ value }}
                <span *ngIf="isDuplicate(i)" class="status">DUPLICATE</span>
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Distinct Values</h4>
            <div class="values">
              <div *ngFor="let value of distinctValues" class="value distinct">
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

    .value.unique {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
    }

    .value.duplicate {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      opacity: 0.7;
    }

    .value.distinct {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
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
export class DistinctUntilChangedComponent implements OnInit, OnDestroy {
  allValues: string[] = [];
  distinctValues: string[] = [];
  isRunning = false;
  private valueSubject = new Subject<string>();
  private subscription?: Subscription;

  codeExample = `import { fromEvent } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

// Monitor form input changes
const input$ = fromEvent(inputElement, 'input').pipe(
  map(event => event.target.value),
  distinctUntilChanged() // Only emit when value actually changes
);

input$.subscribe(value => {
  console.log('Value changed to:', value);
  // Make API call only when value actually changes
});

// Example sequence: 'a', 'a', 'ab', 'ab', 'abc'
// Output: 'a', 'ab', 'abc' (duplicates filtered out)`;

  ngOnInit() {
    // Set up distinct subscription
    this.subscription = this.valueSubject.pipe(
      distinctUntilChanged()
    ).subscribe(value => {
      this.distinctValues.push(value);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  simulateValues() {
    this.clearResults();
    this.isRunning = true;

    // Simulate values with consecutive duplicates
    const values = ['A', 'A', 'B', 'B', 'B', 'C', 'C', 'D', 'D', 'E'];
    const delays = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];

    values.forEach((value, index) => {
      setTimeout(() => {
        this.allValues.push(value);
        this.valueSubject.next(value);
        
        if (index === values.length - 1) {
          this.isRunning = false;
        }
      }, delays[index]);
    });
  }

  isDuplicate(index: number): boolean {
    if (index === 0) return false;
    return this.allValues[index] === this.allValues[index - 1];
  }

  clearResults() {
    this.allValues = [];
    this.distinctValues = [];
  }
}
