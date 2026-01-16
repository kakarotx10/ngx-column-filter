# Column Filter Library - Usage Examples

## 1. Clear Filter as Exported Function

You can call the `clearFilter()` method programmatically from any component:

### Using ViewChild:

```typescript
import { Component, ViewChild } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';

@Component({
  selector: 'app-example',
  template: `
    <table>
      <thead>
        <tr>
          <th>
            Name
            <lib-column-filter
              #nameFilter
              columnName="name"
              columnKey="name"
              (filterApplied)="onFilter($event)">
            </lib-column-filter>
          </th>
        </tr>
      </thead>
    </table>
    
    <button (click)="clearNameFilter()">Clear Name Filter</button>
  `
})
export class ExampleComponent {
  @ViewChild('nameFilter') nameFilter!: ColumnFilterComponent;

  clearNameFilter() {
    // Programmatically clear the filter
    this.nameFilter.clearFilter();
  }

  onFilter(filterConfig: FilterConfig) {
    // Handle filter applied
  }
}
```

### Using Multiple Filters:

```typescript
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';

@Component({
  selector: 'app-example',
  template: `
    <table>
      <thead>
        <tr>
          <th>
            First Name
            <lib-column-filter
              #firstNameFilter
              columnName="first name"
              columnKey="firstName">
            </lib-column-filter>
          </th>
          <th>
            Last Name
            <lib-column-filter
              #lastNameFilter
              columnName="last name"
              columnKey="lastName">
            </lib-column-filter>
          </th>
        </tr>
      </thead>
    </table>
    
    <button (click)="clearAllFilters()">Clear All Filters</button>
  `
})
export class ExampleComponent {
  @ViewChildren(ColumnFilterComponent) filters!: QueryList<ColumnFilterComponent>;

  clearAllFilters() {
    // Clear all filters programmatically
    this.filters.forEach(filter => {
      filter.clearFilter();
    });
  }
}
```

---

## 2. Only One Column Filter Open at a Time

This feature is automatically enabled. When you open one filter, others will automatically close.

**No additional code needed!** This works automatically.

Example:
- First Name filter is open
- User opens Last Name filter
- First Name filter automatically closes

---

## 3. ESC Key Support

Pressing the ESC key will automatically close the open filter.

**No additional code needed!** This works automatically.

### How it works:
1. User opens filter dropdown
2. User presses ESC key
3. Filter dropdown automatically closes

---

## Complete Example

```typescript
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  imports: [ColumnFilterComponent],
  template: `
    <div>
      <button (click)="clearFirstNameFilter()">Clear First Name Filter</button>
      <button (click)="clearAllFilters()">Clear All Filters</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>
            First Name
            <lib-column-filter
              #firstNameFilter
              columnName="first name"
              columnKey="firstName"
              (filterApplied)="onFirstNameFilter($event)"
              (filterCleared)="onFirstNameClear()">
            </lib-column-filter>
          </th>
          <th>
            Last Name
            <lib-column-filter
              #lastNameFilter
              columnName="last name"
              columnKey="lastName"
              (filterApplied)="onLastNameFilter($event)">
            </lib-column-filter>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of filteredUsers">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class UserListComponent {
  users: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
  ];
  
  filteredUsers: User[] = [...this.users];
  firstNameFilter: FilterConfig | null = null;
  lastNameFilter: FilterConfig | null = null;

  // Using ViewChild for single filter
  @ViewChild('firstNameFilter') firstNameFilterComponent!: ColumnFilterComponent;

  // Using ViewChildren for multiple filters
  @ViewChildren(ColumnFilterComponent) allFilters!: QueryList<ColumnFilterComponent>;

  // Clear single filter programmatically
  clearFirstNameFilter() {
    this.firstNameFilterComponent.clearFilter();
  }

  // Clear all filters programmatically
  clearAllFilters() {
    this.allFilters.forEach(filter => {
      filter.clearFilter();
    });
    // Also clear filter configs
    this.firstNameFilter = null;
    this.lastNameFilter = null;
    this.filteredUsers = [...this.users];
  }

  onFirstNameFilter(filterConfig: FilterConfig) {
    this.firstNameFilter = filterConfig;
    this.applyFilters();
  }

  onFirstNameClear() {
    this.firstNameFilter = null;
    this.applyFilters();
  }

  onLastNameFilter(filterConfig: FilterConfig) {
    this.lastNameFilter = filterConfig;
    this.applyFilters();
  }

  private applyFilters() {
    let result = [...this.users];
    
    if (this.firstNameFilter) {
      result = applyColumnFilter(result, 'firstName', this.firstNameFilter);
    }
    
    if (this.lastNameFilter) {
      result = applyColumnFilter(result, 'lastName', this.lastNameFilter);
    }
    
    this.filteredUsers = result;
  }
}
```

---

---

## 4. Backend Mode - Backend API Integration

Use backend mode when you want to send filter data to your backend API instead of filtering locally.

### Basic Backend Mode Example:

```typescript
import { Component } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig } from 'ngx-column-filter-popup';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-backend-example',
  imports: [ColumnFilterComponent],
  template: `
    <lib-column-filter
      columnName="first name"
      columnKey="firstName"
      [backendMode]="true"
      (filterApplied)="onFilterApplied('firstName', $event)"
      (filterCleared)="onFilterCleared('firstName')">
    </lib-column-filter>

    <lib-column-filter
      columnName="email"
      columnKey="email"
      [backendMode]="true"
      (filterApplied)="onFilterApplied('email', $event)"
      (filterCleared)="onFilterCleared('email')">
    </lib-column-filter>
  `
})
export class BackendExampleComponent {
  filters = new Map<string, FilterConfig | null>();
  readonly backendModeColumns = new Set<string>(['firstName', 'email']);

  constructor(private http: HttpClient) {}

  onFilterApplied(columnKey: string, filterConfig: FilterConfig) {
    this.filters.set(columnKey, filterConfig);
    this.sendToBackend();
  }

  onFilterCleared(columnKey: string) {
    this.filters.set(columnKey, null);
    this.sendToBackend();
  }

  private sendToBackend() {
    const activeFilters: Array<{
      field: string;
      matchType: string;
      value: string;
      fieldType: string;
    }> = [];

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

    // Send to backend API
    this.http.post('/api/filters', payload).subscribe({
      next: (response: any) => {
        // Update your data with backend response
        console.log('Backend response:', response);
      },
      error: (error) => {
        console.error('Backend error:', error);
      }
    });
  }
}
```

### Mixed Mode (Frontend + Backend):

Combine frontend and backend filters:

```typescript
export class MixedModeComponent {
  filters = new Map<string, FilterConfig | null>();
  readonly backendModeColumns = new Set<string>(['firstName', 'email']);
  originalData: any[] = [...];
  filteredData: any[] = [...];

  onFilterApplied(columnKey: string, filterConfig: FilterConfig) {
    this.filters.set(columnKey, filterConfig);
    
    if (this.backendModeColumns.has(columnKey)) {
      this.sendToBackend();
    } else {
      this.applyFrontendFilters();
    }
  }

  private applyFrontendFilters() {
    let result = [...this.originalData];

    this.filters.forEach((filterConfig, columnKey) => {
      // Skip backend mode columns
      if (filterConfig && !this.backendModeColumns.has(columnKey)) {
        result = applyColumnFilter(result, columnKey, filterConfig);
      }
    });

    this.filteredData = result;
  }
}
```

---

## Features Summary

✅ **Clear Filter Programmatically**: Call `clearFilter()` method  
✅ **Only One Filter Open**: Automatically handled  
✅ **ESC Key Support**: Automatically handled  
✅ **Backend Mode**: Send filter payloads to backend API  
✅ **Blinking Active Icon**: Visual feedback for active filters  

**All features work automatically - no additional configuration needed!**
