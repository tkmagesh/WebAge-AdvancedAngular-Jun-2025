import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-debounce-time',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="operator-container">
      <h2>DebounceTime Operator</h2>
      
      <div class="operator-info">
        <h3>Description</h3>
        <p>The <code>debounceTime</code> operator emits a value only after a specified time has passed without another emission.</p>
        
        <h3>Use Cases</h3>
        <ul>
          <li>Search input optimization</li>
          <li>Button click protection</li>
          <li>API call throttling</li>
          <li>Form validation delays</li>
        </ul>
        
        <h3>Syntax</h3>
        <pre><code>source$.pipe(debounceTime(milliseconds))</code></pre>
      </div>

      <div class="demo-section">
        <h3>Live Demo - Search Input Simulation</h3>
        <div class="demo-controls">
          <button (click)="simulateTyping()" [disabled]="isRunning">Simulate Fast Typing</button>
          <button (click)="clearResults()">Clear Results</button>
        </div>
        
        <div class="results">
          <div class="result-column">
            <h4>All Keystrokes</h4>
            <div class="values">
              <div *ngFor="let keystroke of allKeystrokes" class="value keystroke">
                "{{ keystroke }}"
              </div>
            </div>
          </div>
          
          <div class="arrow">→</div>
          
          <div class="result-column">
            <h4>Debounced Output (500ms)</h4>
            <div class="values">
              <div *ngFor="let output of debouncedOutput" class="value debounced">
                "{{ output }}"
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

    .value.keystroke {
      background: #fce4ec;
      border-left: 4px solid #e91e63;
    }

    .value.debounced {
      background: #e0f2f1;
      border-left: 4px solid #009688;
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
export class DebounceTimeComponent implements OnInit, OnDestroy {
  allKeystrokes: string[] = [];
  debouncedOutput: string[] = [];
  isRunning = false;
  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  codeExample = `import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

// Get search input element
const searchInput = document.getElementById('search');

// Create observable from input events
const searchInput$ = fromEvent(searchInput, 'input').pipe(
  map(event => event.target.value),
  debounceTime(500) // Wait 500ms after user stops typing
);

// Subscribe to debounced search
searchInput$.subscribe(searchTerm => {
  console.log('Searching for:', searchTerm);
  // Perform search API call here
});`;

  ngOnInit() {
    // Set up debounced subscription
    this.subscription = this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.debouncedOutput.push(value);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  simulateTyping() {
    this.clearResults();
    this.isRunning = true;

    const searchTerm = 'angular';
    const delays = [100, 150, 200, 100, 300, 150, 200]; // Simulate varying typing speeds

    let currentText = '';
    let index = 0;

    const typeNextChar = () => {
      if (index < searchTerm.length) {
        currentText += searchTerm[index];
        this.allKeystrokes.push(currentText);
        this.searchSubject.next(currentText);
        
        index++;
        setTimeout(typeNextChar, delays[index - 1] || 150);
      } else {
        this.isRunning = false;
      }
    };

    typeNextChar();
  }

  clearResults() {
    this.allKeystrokes = [];
    this.debouncedOutput = [];
  }
}
