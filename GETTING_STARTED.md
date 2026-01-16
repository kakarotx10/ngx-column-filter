# Getting Started - Complete Tutorial

Complete step-by-step guide to use `ngx-column-filter-popup` in your Angular application.

## 📋 Table of Contents

1. [Installation](#installation)
2. [Basic Setup](#basic-setup)
3. [Understanding Imports](#understanding-imports)
4. [Basic Usage Example](#basic-usage-example)
5. [Complete Working Example](#complete-working-example)
6. [All Field Types](#all-field-types)
7. [Applying Filters to Data](#applying-filters-to-data)
8. [Advanced Examples](#advanced-examples)
9. [Backend Mode (Optional)](#backend-mode-optional)

---

## 1. Installation

First, install the package:

```bash
npm install ngx-column-filter-popup
```

---

## 2. Basic Setup

### Step 1: Import the Component

In your Angular component file (`.ts`), import what you need:

```typescript
import { Component } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';
```

**What each import does:**
- `ColumnFilterComponent` - The main filter component
- `FilterConfig` - TypeScript type/interface for filter configuration
- `applyColumnFilter` - Utility function to filter your data array

### Step 2: Add to Component Imports

If using **Standalone Components** (Angular 14+):

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ColumnFilterComponent], // Add here
  templateUrl: './my-component.html'
})
```

If using **NgModules** (Traditional Angular):

```typescript
// In your module file (e.g., app.module.ts)
import { NgModule } from '@angular/core';
import { ColumnFilterModule } from 'ngx-column-filter-popup';

@NgModule({
  imports: [
    ColumnFilterModule, // Add here
    // ... other imports
  ],
  // ...
})
```

### Step 3: Use in Template

In your component template (`.html`):

```html
<lib-column-filter
  columnName="name"
  columnKey="name"
  (filterApplied)="onFilter($event)"
  (filterCleared)="onFilterCleared()">
</lib-column-filter>
```

---

## 3. Understanding Imports

### What to Import and When:

#### Always Import:
```typescript
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
```
- **When:** You want to use the filter component in your template
- **Used in:** Component imports array

#### For TypeScript Types:
```typescript
import { FilterConfig } from 'ngx-column-filter-popup';
```
- **When:** You need to type your filter variables/parameters
- **Example:** `filterConfig: FilterConfig`

#### For Filtering Data:
```typescript
import { applyColumnFilter } from 'ngx-column-filter-popup';
```
- **When:** You want to filter your data array based on filter config
- **Example:** `const filtered = applyColumnFilter(data, 'columnKey', filterConfig)`

#### For Module-Based (Optional):
```typescript
import { ColumnFilterModule } from 'ngx-column-filter-popup';
```
- **When:** Using NgModules instead of standalone components
- **Used in:** NgModule imports array

#### All Available Imports:
```typescript
// Component
import { ColumnFilterComponent } from 'ngx-column-filter-popup';

// Module (if using NgModules)
import { ColumnFilterModule } from 'ngx-column-filter-popup';

// Types/Interfaces
import { 
  FilterConfig, 
  FilterRule, 
  MatchType, 
  FieldType,
  GlobalMatchMode 
} from 'ngx-column-filter-popup';

// Utility Functions
import { 
  applyColumnFilter, 
  itemMatchesFilter 
} from 'ngx-column-filter-popup';

// Service (advanced - usually not needed)
import { ColumnFilterService } from 'ngx-column-filter-popup';
```

---

## 4. Basic Usage Example

Complete minimal example:

### component.ts
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ColumnFilterComponent],
  template: `
    <h2>Users</h2>
    <table>
      <thead>
        <tr>
          <th>
            Name
            <lib-column-filter
              columnName="name"
              columnKey="name"
              (filterApplied)="onNameFilter($event)"
              (filterCleared)="onNameFilterCleared()">
            </lib-column-filter>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of filteredUsers">
          <td>{{ user.name }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class UserListComponent {
  users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];
  
  filteredUsers = [...this.users];
  nameFilter: FilterConfig | null = null;

  onNameFilter(filterConfig: FilterConfig) {
    this.nameFilter = filterConfig;
    this.applyFilters();
  }

  onNameFilterCleared() {
    this.nameFilter = null;
    this.applyFilters();
  }

  private applyFilters() {
    let result = [...this.users];
    
    if (this.nameFilter) {
      result = applyColumnFilter(result, 'name', this.nameFilter);
    }
    
    this.filteredUsers = result;
  }
}
```

**Important:** Don't forget to import `applyColumnFilter`:
```typescript
import { applyColumnFilter } from 'ngx-column-filter-popup';
```

---

## 5. Complete Working Example

Full example with multiple columns and different field types:

### component.ts
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  balance: number;
  joinDate: string;
  status: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ColumnFilterComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent {
  users: User[] = [
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com',
      age: 30, 
      balance: 50000, 
      joinDate: '2020-01-15',
      status: 'active'
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane@example.com',
      age: 25, 
      balance: 75000, 
      joinDate: '2019-05-20',
      status: 'active'
    },
    { 
      id: 3, 
      firstName: 'Bob', 
      lastName: 'Johnson', 
      email: 'bob@example.com',
      age: 35, 
      balance: 30000, 
      joinDate: '2021-03-10',
      status: 'inactive'
    }
  ];

  filteredUsers: User[] = [...this.users];
  
  // Store filter configs for each column
  firstNameFilter: FilterConfig | null = null;
  ageFilter: FilterConfig | null = null;
  balanceFilter: FilterConfig | null = null;
  dateFilter: FilterConfig | null = null;
  statusFilter: FilterConfig | null = null;
  
  statusOptions = ['active', 'inactive', 'on-leave'];

  // Filter event handlers
  onFirstNameFilter(filterConfig: FilterConfig) {
    this.firstNameFilter = filterConfig;
    this.applyAllFilters();
  }

  onFirstNameClear() {
    this.firstNameFilter = null;
    this.applyAllFilters();
  }

  onAgeFilter(filterConfig: FilterConfig) {
    this.ageFilter = filterConfig;
    this.applyAllFilters();
  }

  onBalanceFilter(filterConfig: FilterConfig) {
    this.balanceFilter = filterConfig;
    this.applyAllFilters();
  }

  onDateFilter(filterConfig: FilterConfig) {
    this.dateFilter = filterConfig;
    this.applyAllFilters();
  }

  onStatusFilter(filterConfig: FilterConfig) {
    this.statusFilter = filterConfig;
    this.applyAllFilters();
  }

  // Apply all active filters
  private applyAllFilters() {
    let result = [...this.users];

    if (this.firstNameFilter) {
      result = applyColumnFilter(result, 'firstName', this.firstNameFilter);
    }
    if (this.ageFilter) {
      result = applyColumnFilter(result, 'age', this.ageFilter);
    }
    if (this.balanceFilter) {
      result = applyColumnFilter(result, 'balance', this.balanceFilter);
    }
    if (this.dateFilter) {
      result = applyColumnFilter(result, 'joinDate', this.dateFilter);
    }
    if (this.statusFilter) {
      result = applyColumnFilter(result, 'status', this.statusFilter);
    }

    this.filteredUsers = result;
  }
}
```

### component.html
```html
<table>
  <thead>
    <tr>
      <th>
        First Name
        <lib-column-filter
          columnName="first name"
          columnKey="firstName"
          fieldType="text"
          (filterApplied)="onFirstNameFilter($event)"
          (filterCleared)="onFirstNameClear()">
        </lib-column-filter>
      </th>
      <th>
        Age
        <lib-column-filter
          columnName="age"
          columnKey="age"
          fieldType="age"
          (filterApplied)="onAgeFilter($event)">
        </lib-column-filter>
      </th>
      <th>
        Balance
        <lib-column-filter
          columnName="balance"
          columnKey="balance"
          fieldType="currency"
          currencySymbol="$"
          (filterApplied)="onBalanceFilter($event)">
        </lib-column-filter>
      </th>
      <th>
        Join Date
        <lib-column-filter
          columnName="join date"
          columnKey="joinDate"
          fieldType="date"
          (filterApplied)="onDateFilter($event)">
        </lib-column-filter>
      </th>
      <th>
        Status
        <lib-column-filter
          columnName="status"
          columnKey="status"
          fieldType="status"
          [statusOptions]="statusOptions"
          (filterApplied)="onStatusFilter($event)">
        </lib-column-filter>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let user of filteredUsers">
      <td>{{ user.firstName }}</td>
      <td>{{ user.age }}</td>
      <td>${{ user.balance }}</td>
      <td>{{ user.joinDate }}</td>
      <td>{{ user.status }}</td>
    </tr>
  </tbody>
</table>
```

---

## 6. All Field Types

### Text Field (Default)
```html
<lib-column-filter
  columnName="name"
  columnKey="name"
  fieldType="text"
  (filterApplied)="onFilter($event)">
</lib-column-filter>
```

### Currency Field
```html
<lib-column-filter
  columnName="balance"
  columnKey="balance"
  fieldType="currency"
  currencySymbol="$"
  (filterApplied)="onFilter($event)">
</lib-column-filter>
```

### Age/Number Field
```html
<lib-column-filter
  columnName="age"
  columnKey="age"
  fieldType="age"
  (filterApplied)="onFilter($event)">
</lib-column-filter>
```

### Date Field
```html
<lib-column-filter
  columnName="join date"
  columnKey="joinDate"
  fieldType="date"
  (filterApplied)="onFilter($event)">
</lib-column-filter>
```

### Status Field (with options)
```typescript
// In component.ts
statusOptions = ['active', 'inactive', 'pending'];
```

```html
<lib-column-filter
  columnName="status"
  columnKey="status"
  fieldType="status"
  [statusOptions]="statusOptions"
  (filterApplied)="onFilter($event)">
</lib-column-filter>
```

---

## 7. Applying Filters to Data

### Using `applyColumnFilter` Function

```typescript
import { applyColumnFilter, FilterConfig } from 'ngx-column-filter-popup';

// Your data
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];

// Filter config from component
const filterConfig: FilterConfig = {
  rules: [
    { id: '1', matchType: 'contains', value: 'John' }
  ],
  globalMatchMode: 'match-any-rule'
};

// Apply filter
const filtered = applyColumnFilter(users, 'name', filterConfig);
// Result: [{ name: 'John', age: 30 }]
```

### Using `itemMatchesFilter` Function

Check if a single item matches:

```typescript
import { itemMatchesFilter, FilterConfig } from 'ngx-column-filter-popup';

const user = { name: 'John', age: 30 };
const filterConfig: FilterConfig = { /* ... */ };

const matches = itemMatchesFilter(user, 'name', filterConfig);
// Returns: true or false
```

---

## 8. Advanced Examples

### Programmatic Filter Clear

```typescript
import { Component, ViewChild } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';

@Component({
  template: `
    <lib-column-filter
      #nameFilter
      columnName="name"
      columnKey="name">
    </lib-column-filter>
    <button (click)="clearFilter()">Clear Filter</button>
  `
})
export class MyComponent {
  @ViewChild('nameFilter') filter!: ColumnFilterComponent;

  clearFilter() {
    this.filter.clearFilter();
  }
}
```

### Initial Filter Value

```html
<lib-column-filter
  columnName="name"
  columnKey="name"
  [initialFilter]="initialFilterConfig">
</lib-column-filter>
```

```typescript
import { FilterConfig } from 'ngx-column-filter-popup';

initialFilterConfig: FilterConfig = {
  rules: [
    { id: '1', matchType: 'contains', value: 'John' }
  ],
  globalMatchMode: 'match-any-rule'
};
```

### Custom Placeholder

```html
<lib-column-filter
  columnName="name"
  columnKey="name"
  placeholder="Search by name...">
</lib-column-filter>
```

---

## 📝 Quick Reference

### Required Imports (Minimum)
```typescript
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';
```

### Component Selector
```html
<lib-column-filter></lib-column-filter>
```

### Required Inputs
- `columnName` - Display name (string)
- `columnKey` - Property name to filter (string)

### Optional Inputs
- `fieldType` - 'text' | 'currency' | 'age' | 'date' | 'status'
- `currencySymbol` - For currency fields (default: '$')
- `statusOptions` - Array of strings for status field
- `placeholder` - Custom placeholder text
- `initialFilter` - Initial filter configuration

### Output Events
- `(filterApplied)` - Emits FilterConfig when filter is applied
- `(filterCleared)` - Emits void when filter is cleared

---

## 🎯 Common Patterns

### Pattern 1: Single Filter
```typescript
filterConfig: FilterConfig | null = null;

onFilter(filter: FilterConfig) {
  this.filterConfig = filter;
  this.applyFilter();
}

private applyFilter() {
  this.filteredData = this.filterConfig 
    ? applyColumnFilter(this.data, 'columnKey', this.filterConfig)
    : this.data;
}
```

### Pattern 2: Multiple Filters
```typescript
filters: { [key: string]: FilterConfig | null } = {};

onFilter(columnKey: string, filter: FilterConfig) {
  this.filters[columnKey] = filter;
  this.applyAllFilters();
}

private applyAllFilters() {
  let result = [...this.data];
  Object.keys(this.filters).forEach(key => {
    if (this.filters[key]) {
      result = applyColumnFilter(result, key, this.filters[key]!);
    }
  });
  this.filteredData = result;
}
```

---

## 9. Backend Mode (Optional)

### What is Backend Mode?

When you enable `backendMode`, the component collects filter data and emits it in a format ready for your backend API. No frontend filtering is applied.

### Quick Example:

```html
<lib-column-filter
  columnName="first name"
  columnKey="firstName"
  [backendMode]="true"
  (filterApplied)="onFilterApplied('firstName', $event)"
  (filterCleared)="onFilterCleared('firstName')">
</lib-column-filter>
```

```typescript
filters = new Map<string, FilterConfig | null>();
readonly backendModeColumns = new Set<string>(['firstName', 'email']);

onFilterApplied(columnKey: string, filterConfig: FilterConfig) {
  this.filters.set(columnKey, filterConfig);
  this.sendToBackend(); // Send to your API
}
```

The component emits filter data in this format:
```json
{
  "activeFilters": [
    {
      "field": "firstName",
      "matchType": "contains",
      "value": "John",
      "fieldType": "text"
    }
  ],
  "count": 1
}
```

**📘 For complete backend mode guide**, see [DOCUMENTATION.md](./DOCUMENTATION.md#backend-mode-backend-api-integration) or [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md#4-backend-mode---backend-api-integration).

---

## ❓ Troubleshooting

### Component not showing?
- ✅ Check if `ColumnFilterComponent` is in `imports` array (standalone) or module imports
- ✅ Check if you're using `<lib-column-filter>` selector

### Filter not working?
- ✅ Make sure `columnKey` matches your data property name exactly
- ✅ Make sure you're using `applyColumnFilter` function
- ✅ Check that `filterApplied` event is being handled

### Type errors?
- ✅ Import `FilterConfig` type
- ✅ Type your filter variables: `filter: FilterConfig`

### Styles not working?
- ✅ Component has built-in styles, but check if CSS is being bundled

---

## 📚 More Examples

See:
- [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - More detailed examples
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete API reference
- [Live Demo](https://ngx-column-filter.netlify.app/) - See it in action

---

**Happy Filtering! 🎉**
