import { Component, QueryList, ViewChildren, signal } from '@angular/core';
import { ColumnFilterComponent } from './components/column-filter/column-filter.component';
import { FilterConfig } from './lib/models/filter.models';
import { applyColumnFilter } from './lib/utils/column-filter.utils';
import { CommonModule } from '@angular/common';

interface SampleData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  balance?: number;
  date?: string;
  status?: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ColumnFilterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Column Filter Library Demo');

  // Access all filter components to clear UI state when needed
  @ViewChildren(ColumnFilterComponent) filterComponents!: QueryList<ColumnFilterComponent>;

  // Sample data
  originalData: SampleData[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'Developer', balance: 70663, date: '2015-09-13', status: 'qualified' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'Designer', balance: 82429, date: '2019-02-09', status: 'negotiation' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', role: 'Manager', balance: 28334, date: '2020-05-15', status: 'unqualified' },
    { id: 4, firstName: 'Alice', lastName: 'Williams', email: 'alice.williams@example.com', role: 'Developer', balance: 88521, date: '2018-11-20', status: 'qualified' },
    { id: 5, firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', role: 'Designer', balance: 93905, date: '2021-03-10', status: 'new' },
    { id: 6, firstName: 'Diana', lastName: 'Davis', email: 'diana.davis@example.com', role: 'Developer', balance: 45230, date: '2017-07-25', status: 'qualified' },
    { id: 7, firstName: 'Edward', lastName: 'Miller', email: 'edward.miller@example.com', role: 'Manager', balance: 67200, date: '2016-12-05', status: 'negotiation' },
    { id: 8, firstName: 'Fiona', lastName: 'Wilson', email: 'fiona.wilson@example.com', role: 'Designer', balance: 55100, date: '2019-08-18', status: 'new' },
    { id: 9, firstName: 'George', lastName: 'Moore', email: 'george.moore@example.com', role: 'Developer', balance: 78200, date: '2020-01-30', status: 'qualified' },
    { id: 10, firstName: 'Helen', lastName: 'Taylor', email: 'helen.taylor@example.com', role: 'Manager', balance: 91500, date: '2018-04-22', status: 'renewal' }
  ];

  filteredData: SampleData[] = [...this.originalData];

  // ✅ Unified filter storage - single source of truth for all filters
  filters = new Map<string, FilterConfig | null>();

  // ✅ Configuration: Define which columns use backend mode
  readonly backendModeColumns = new Set<string>(['firstName', 'email']);

  // Status options for status field
  statusOptions = ['qualified', 'unqualified', 'negotiation', 'new', 'renewal', 'proposal'];

  // ✅ Generic filter handler - works for all columns
  onFilterApplied(columnKey: string, filterConfig: FilterConfig): void {
    this.filters.set(columnKey, filterConfig);
    
    // Send backend filters if this column uses backend mode
    if (this.isBackendMode(columnKey)) {
      this.sendAllBackendFiltersToBackend();
    }
    
    this.applyAllFilters();
  }

  // ✅ Generic filter clear handler - works for all columns
  onFilterCleared(columnKey: string): void {
    this.filters.set(columnKey, null);
    
    // Send backend filters if this column uses backend mode
    if (this.isBackendMode(columnKey)) {
      this.sendAllBackendFiltersToBackend();
    }
    
    this.applyAllFilters();
  }

  // ✅ Check if a column uses backend mode
  isBackendMode(columnKey: string): boolean {
    return this.backendModeColumns.has(columnKey);
  }

  // ✅ Get filter config for a column
  getFilter(columnKey: string): FilterConfig | null {
    return this.filters.get(columnKey) || null;
  }

  // ✅ Apply all filters - automatically skips backend mode columns
  private applyAllFilters(): void {
    let result = [...this.originalData];

    // Loop through all filters and apply frontend filters only
    this.filters.forEach((filterConfig, columnKey) => {
      // Skip backend mode columns (they're handled by backend API)
      if (filterConfig && !this.isBackendMode(columnKey)) {
        result = applyColumnFilter(result, columnKey, filterConfig);
      }
    });

    this.filteredData = result;
  }

  // ✅ Get count of active filters
  getActiveFiltersCount(): number {
    let count = 0;
    this.filters.forEach((filterConfig) => {
      if (filterConfig) count++;
    });
    return count;
  }

  // ✅ Clear all filters
  clearAllFilters(): void {
    this.filters.clear();
    this.sendAllBackendFiltersToBackend();
    this.filteredData = [...this.originalData];

    // Clear UI state in all filter components (icons/inputs)
    if (this.filterComponents) {
      this.filterComponents.forEach((filter: ColumnFilterComponent) => filter.clearFilter());
    }
  }

  // ✅ Get all active filters as a simple array (for easy reading/inspection)
  getActiveFilters(): Array<{ field: string; matchType: string; value: string; fieldType: string }> {
    const activeFilters: Array<{ field: string; matchType: string; value: string; fieldType: string }> = [];
    
    this.filters.forEach((filterConfig, columnKey) => {
      if (filterConfig && filterConfig.rules.length > 0) {
        filterConfig.rules.forEach(rule => {
          if (rule.value && rule.value.trim() !== '') {
            activeFilters.push({
              field: columnKey,
              matchType: rule.matchType,
              value: rule.value.trim(),
              fieldType: filterConfig.fieldType || 'text'
            });
          }
        });
      }
    });

    return activeFilters;
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }

  /**
   * ✅ Collect and send all active backend filters to backend API
   * Automatically processes all columns that use backend mode
   * 
   * Payload format:
   * {
   *   "activeFilters": [
   *     { "field": "firstName", "matchType": "contains", "value": "test", "fieldType": "text" },
   *     { "field": "email", "matchType": "contains", "value": "testtt", "fieldType": "text" }
   *   ],
   *   "count": 2
   * }
   */
  private sendAllBackendFiltersToBackend(): void {
    const activeFilters: Array<{
      field: string;
      matchType: string;
      value: string;
      fieldType: string;
    }> = [];

    // Process all backend mode columns
    this.backendModeColumns.forEach(columnKey => {
      const filterConfig = this.filters.get(columnKey);
      
      if (filterConfig && filterConfig.rules.length > 0) {
        filterConfig.rules.forEach(rule => {
          if (rule.value && rule.value.trim() !== '') {
            activeFilters.push({
              field: columnKey,
              matchType: rule.matchType,
              value: rule.value.trim(),
              fieldType: filterConfig.fieldType || 'text'
            });
          }
        });
      }
    });

    const payload = {
      activeFilters: activeFilters,
      count: activeFilters.length
    };

    // Log the payload (in production, send this to your backend API)
    console.log('📤 Sending all active backend filters to API:', payload);
    
    // Example: Actual API call would look like this:
    // this.httpClient.post('/api/filters', payload).subscribe({
    //   next: (response) => {
    //     // Update filteredData with response from backend
    //     this.filteredData = response.data;
    //   },
    //   error: (error) => {
    //     console.error('Error sending filters to backend:', error);
    //   }
    // });
  }
}