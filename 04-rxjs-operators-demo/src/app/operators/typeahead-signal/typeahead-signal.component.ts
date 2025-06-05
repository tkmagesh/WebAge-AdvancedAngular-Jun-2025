import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { 
  Subject, 
  Observable, 
  of, 
  timer
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  retry,
  tap,
  filter,
  startWith,
  takeUntil,
  delay,
  finalize
} from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

interface SearchResult {
  id: number;
  name: string;
  category: string;
  description: string;
  highlight?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  timestamp: string;
  error?: string;
}

@Component({
  selector: 'app-typeahead-signal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="typeahead-container">
      <h2>Advanced Typeahead Search with Signals</h2>
      
      <div class="info-section">
        <h3>Angular Signals + RxJS Operators</h3>
        <div class="operators-grid">
          <span class="operator-badge signal-badge">Angular Signals</span>
          <span class="operator-badge" *ngFor="let op of usedOperators">{{ op }}</span>
        </div>
        <p class="signal-info">
          This component demonstrates Angular Signals for reactive state management combined with RxJS operators for async operations.
        </p>
      </div>

      <div class="search-section">
        <div class="search-controls">
          <div class="search-input-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Search for programming languages, frameworks, tools..."
              [value]="searchTerm()"
              (input)="onSearchInput($event)"
            />
            <div class="search-icon" [class.loading]="isLoading()">
              <span *ngIf="!isLoading()">🔍</span>
              <span *ngIf="isLoading()" class="spinner">⟳</span>
            </div>
          </div>

          <div class="controls">
            <label>
              <input 
                type="checkbox" 
                [checked]="useErrorEndpoint()"
                (change)="toggleErrorEndpoint()">
              Use error endpoint (test retry)
            </label>
          </div>
        </div>

        <div class="categories" *ngIf="categories().length > 0">
          <h4>Filter by Category:</h4>
          <label *ngFor="let category of categories()" class="category-filter">
            <input 
              type="checkbox" 
              [checked]="selectedCategories().includes(category)"
              (change)="toggleCategory(category)">
            {{ category }}
          </label>
        </div>

        <div class="stats">
          <div class="stat">
            <span class="label">Search Count:</span>
            <span class="value">{{ searchCount() }}</span>
          </div>
          <div class="stat">
            <span class="label">Results:</span>
            <span class="value">{{ filteredResults().length }}</span>
          </div>
          <div class="stat">
            <span class="label">Query:</span>
            <span class="value">"{{ currentQuery() }}"</span>
          </div>
          <div class="stat">
            <span class="label">Loading:</span>
            <span class="value">{{ isLoading() ? 'Yes' : 'No' }}</span>
          </div>
        </div>

        <div class="error" *ngIf="error() as errorMsg">
          <strong>Error:</strong> {{ errorMsg }}
        </div>

        <div class="results" *ngIf="filteredResults().length > 0">
          <div class="result-item" *ngFor="let result of filteredResults()">
            <div class="result-header">
              <h4 [innerHTML]="result.highlight || result.name"></h4>
              <span class="category-badge" [attr.data-category]="result.category">
                {{ result.category }}
              </span>
            </div>
            <p class="description">{{ result.description }}</p>
          </div>
        </div>

        <div class="no-results" *ngIf="filteredResults().length === 0 && currentQuery() && !isLoading()">
          No results found for "{{ currentQuery() }}"
        </div>

        <div class="recent-searches" *ngIf="recentSearches().length > 0">
          <h4>Recent Searches:</h4>
          <div class="recent-list">
            <span 
              *ngFor="let search of recentSearches()" 
              class="recent-item"
              (click)="selectRecentSearch(search)">
              {{ search }}
            </span>
          </div>
        </div>
      </div>

      <div class="signals-info">
        <h3>Signals State</h3>
        <div class="signal-state">
          <div class="signal-item">
            <strong>searchTerm:</strong> {{ searchTerm() }}
          </div>
          <div class="signal-item">
            <strong>isLoading:</strong> {{ isLoading() }}
          </div>
          <div class="signal-item">
            <strong>searchResults:</strong> {{ searchResults().length }} items
          </div>
          <div class="signal-item">
            <strong>selectedCategories:</strong> {{ selectedCategories().join(', ') || 'None' }}
          </div>
          <div class="signal-item">
            <strong>filteredResults:</strong> {{ filteredResults().length }} items (computed)
          </div>
        </div>
      </div>

      <div class="operator-flow">
        <h3>Data Flow: Signals + RxJS</h3>
        <div class="flow-diagram">
          <div class="flow-step signal-step">Input Event → searchTerm Signal</div>
          <div class="flow-step">→ debounceTime(300ms)</div>
          <div class="flow-step">→ distinctUntilChanged()</div>
          <div class="flow-step">→ filter(length > 2)</div>
          <div class="flow-step">→ tap(logging)</div>
          <div class="flow-step">→ switchMap(API call)</div>
          <div class="flow-step">→ retry(3)</div>
          <div class="flow-step">→ catchError()</div>
          <div class="flow-step signal-step">→ Update Signals</div>
          <div class="flow-step signal-step">→ computed() → filteredResults</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .typeahead-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .info-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .signal-info {
      margin-top: 15px;
      padding: 10px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      font-size: 14px;
      color: #1565c0;
    }

    .operators-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .operator-badge {
      background: #007bff;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .signal-badge {
      background: #ff6b35;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .search-section {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .search-input-wrapper {
      position: relative;
      margin-bottom: 20px;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border-color 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }

    .search-icon.loading .spinner {
      display: inline-block;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .controls {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .categories {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .categories h4 {
      margin: 0 0 10px 0;
      color: #555;
    }

    .category-filter {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      margin-right: 15px;
      cursor: pointer;
    }

    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 10px;
      background: #e9ecef;
      border-radius: 4px;
    }

    .stat {
      display: flex;
      gap: 5px;
    }

    .stat .label {
      font-weight: 600;
      color: #666;
    }

    .stat .value {
      color: #007bff;
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .results {
      margin-top: 20px;
    }

    .result-item {
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 10px;
      transition: all 0.3s;
      animation: fadeIn 0.3s ease-in;
    }

    .result-item:hover {
      border-color: #007bff;
      box-shadow: 0 2px 8px rgba(0,123,255,0.1);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .result-header h4 {
      margin: 0;
      color: #333;
    }

    .result-header h4 mark {
      background: #fff3cd;
      padding: 2px 4px;
      border-radius: 3px;
    }

    .category-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: #e9ecef;
      color: #495057;
    }

    .category-badge[data-category="Programming Language"] {
      background: #d1ecf1;
      color: #0c5460;
    }

    .category-badge[data-category="Framework"] {
      background: #d4edda;
      color: #155724;
    }

    .category-badge[data-category="Library"] {
      background: #fff3cd;
      color: #856404;
    }

    .category-badge[data-category="Database"] {
      background: #f8d7da;
      color: #721c24;
    }

    .category-badge[data-category="Tool"] {
      background: #e2e3e5;
      color: #383d41;
    }

    .description {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .recent-searches {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .recent-searches h4 {
      margin: 0 0 10px 0;
      color: #555;
    }

    .recent-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .recent-item {
      padding: 4px 12px;
      background: #e9ecef;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .recent-item:hover {
      background: #007bff;
      color: white;
    }

    .signals-info {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 2px solid #ff9800;
    }

    .signals-info h3 {
      margin: 0 0 15px 0;
      color: #e65100;
    }

    .signal-state {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 10px;
    }

    .signal-item {
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
      border-left: 3px solid #ff9800;
    }

    .operator-flow {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .flow-diagram {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }

    .flow-step {
      padding: 10px 15px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
    }

    .signal-step {
      background: #fff3e0;
      border-color: #ff9800;
      font-weight: 600;
    }

    @keyframes fadeIn {
      from { 
        opacity: 0; 
        transform: translateY(-10px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `]
})
export class TypeaheadSignalComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Signals for component state
  searchTerm = signal('');
  useErrorEndpoint = signal(false);
  selectedCategories = signal<string[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  searchResults = signal<SearchResult[]>([]);
  currentQuery = signal('');
  searchCount = signal(0);
  recentSearches = signal<string[]>([]);

  // Computed signals
  filteredResults = computed(() => {
    const results = this.searchResults();
    const categories = this.selectedCategories();
    
    if (categories.length === 0) {
      return results;
    }
    
    return results.filter(result => categories.includes(result.category));
  });

  // Categories signal from HTTP
  categories = toSignal(
    this.http.get<string[]>('http://localhost:3001/api/categories').pipe(
      catchError(() => of(['Programming Language', 'Framework', 'Library', 'Database', 'Tool'])),
      startWith([])
    ),
    { initialValue: [] }
  );

  usedOperators = [
    'debounceTime', 'distinctUntilChanged', 'switchMap', 'catchError',
    'retry', 'tap', 'filter', 'startWith', 'delay', 'finalize', 'toSignal'
  ];

  ngOnInit() {
    // Create search stream with RxJS operators
    const search$ = this.searchSubject.pipe(
      tap(term => console.log('1. Input received:', term)),
      
      // Debounce user input
      debounceTime(300),
      tap(term => console.log('2. After debounce:', term)),
      
      // Only emit if value changed
      distinctUntilChanged(),
      tap(term => console.log('3. After distinctUntilChanged:', term)),
      
      // Filter out short queries
      filter(term => term.length > 2 || term.length === 0),
      tap(term => console.log('4. After filter:', term)),
      
      // Log search attempt
      tap(term => {
        if (term) {
          console.log('5. Searching for:', term);
          this.isLoading.set(true);
          this.error.set(null);
          this.currentQuery.set(term);
        } else {
          this.isLoading.set(false);
          this.searchResults.set([]);
          this.currentQuery.set('');
        }
      }),
      
      // Switch to API call
      switchMap((term: string): Observable<SearchResponse> => {
        if (!term) {
          return of({ query: '', results: [], total: 0, timestamp: new Date().toISOString() });
        }
        
        const endpoint = this.useErrorEndpoint() 
          ? 'http://localhost:3001/api/search-with-errors'
          : 'http://localhost:3001/api/search';
          
        return this.http.get<SearchResponse>(`${endpoint}?q=${term}`).pipe(
          // Retry failed requests
          retry({
            count: 3,
            delay: (error, retryCount) => {
              console.log(`Retry attempt ${retryCount} after error:`, error.message);
              return timer(1000 * retryCount);
            }
          }),
          
          // Handle errors
          catchError(error => {
            console.error('Search error:', error);
            this.error.set(error.message || 'Search failed');
            return of({
              query: term,
              results: [],
              total: 0,
              timestamp: new Date().toISOString(),
              error: error.message || 'Search failed'
            });
          }),
          
          // Add artificial delay for demo
          delay(200),
          
          // Log response
          tap(response => console.log('6. API response:', response)),
          
          // Finalize
          finalize(() => {
            console.log('7. Request completed');
            this.isLoading.set(false);
          })
        );
      }),
      
      takeUntil(this.destroy$)
    );

    // Subscribe to search results and update signals
    search$.subscribe(
      (response) => {
        console.log('8. Updating signals with response:', response);
        const searchResponse = response as SearchResponse;
        this.searchResults.set(searchResponse?.results || []);
        this.error.set(searchResponse?.error || null);
        if (searchResponse?.query) {
          this.searchCount.update(count => count + 1);
          // Update recent searches
          const current = this.recentSearches();
          const updated = [searchResponse.query, ...current.filter(s => s !== searchResponse.query)].slice(0, 5);
          this.recentSearches.set(updated);
        }
      },
      (error) => {
        console.error('Search stream error:', error);
        this.error.set('Search failed');
        this.isLoading.set(false);
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    console.log('Input event:', value);
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  toggleErrorEndpoint() {
    this.useErrorEndpoint.update(value => !value);
  }

  toggleCategory(category: string) {
    this.selectedCategories.update(categories => {
      if (categories.includes(category)) {
        return categories.filter(c => c !== category);
      } else {
        return [...categories, category];
      }
    });
  }

  selectRecentSearch(search: string) {
    this.searchTerm.set(search);
    this.searchSubject.next(search);
  }
}
