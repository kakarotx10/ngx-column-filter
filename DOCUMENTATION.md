# Column Filter Library - Complete Documentation

## What is This Component?

This is a **reusable Angular column filter component** that provides advanced filtering capabilities for tables, lists, or any data grid.

### Key Features:

1. **Multiple Filter Rules**: Add multiple filter conditions per column
2. **Multiple Field Types**: Specialized filters for different data types:
   - **Text** - For text fields (default)
   - **Currency** - For currency values (with currency symbol)
   - **Age/Number** - For numeric values (simple number input)
   - **Date** - For date values (date picker)
   - **Status** - For predefined status options (dropdown)

3. **Various Match Types**: Different matching options available based on field type:
   - **Text Fields**: Match All, Match Any, Starts with, Ends with, Contains, Equals
   - **Currency/Age Fields**: Equals, Greater than, Less than, Greater or equal, Less or equal
   - **Date Fields**: Date is, Date is not, Date is before, Date is after, Date is on
   - **Status Fields**: Is, Is not, Equals

4. **Global Match Mode**:
   - **Match All Rules** (AND Logic): When multiple rules exist, **all rules** must match
   - **Match Any Rule** (OR Logic): When multiple rules exist, **any one rule** can match (Default)

5. **Visual Feedback**: Blinking red filter icon with X mark when active - smooth animation clearly indicates applied filters
6. **Backend Mode**: Send filter payloads directly to your backend API instead of filtering locally
7. **Fully Customizable**: Easily configure according to your data
8. **Single Filter Open**: Only one filter dropdown can be open at a time
9. **ESC Key Support**: Press ESC to close the open filter
10. **Programmatic Control**: Clear filters programmatically using `clearFilter()` method

---

## How to Use?

### Basic Usage:

```typescript
import { Component } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  imports: [ColumnFilterComponent],
  template: `
    <table>
      <thead>
        <tr>
          <th>
            First Name
            <lib-column-filter
              columnName="first name"
              columnKey="firstName"
              (filterApplied)="onFirstNameFilter($event)"
              (filterCleared)="onFirstNameClear()">
            </lib-column-filter>
          </th>
          <th>
            Last Name
            <lib-column-filter
              columnName="last name"
              columnKey="lastName"
              (filterApplied)="onLastNameFilter($event)"
              (filterCleared)="onLastNameClear()">
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
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'Designer' }
  ];
  
  filteredUsers: User[] = [...this.users];
  firstNameFilter: FilterConfig | null = null;
  lastNameFilter: FilterConfig | null = null;

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

  onLastNameClear() {
    this.lastNameFilter = null;
    this.applyFilters();
  }

  private applyFilters() {
    let result = [...this.users];
    
    // Apply firstName filter
    if (this.firstNameFilter) {
      result = applyColumnFilter(result, 'firstName', this.firstNameFilter);
    }
    
    // Apply lastName filter
    if (this.lastNameFilter) {
      result = applyColumnFilter(result, 'lastName', this.lastNameFilter);
    }
    
    this.filteredUsers = result;
  }
}
```

---

## Data Adaptation

When you change your **original data**, the component will automatically adapt. You only need to update **two things in HTML**:

1. **`columnKey`**: The property name to filter on
   - Example: If your data has `name` field, use `columnKey="name"`

2. **`columnName`**: The display name shown to users (used in placeholder)
   - Example: `columnName="employee name"` or `columnName="customer name"`

### Example - Adapting to Data Changes:

```typescript
// Your previous data:
interface OldData {
  firstName: string;
  lastName: string;
}

// Your new data:
interface NewData {
  employeeName: string;
  department: string;
  salary: number;
  location: string;
}
```

**Update HTML:**
```html
<!-- Old -->
<lib-column-filter
  columnName="first name"
  columnKey="firstName"
  (filterApplied)="onFirstNameFilter($event)">
</lib-column-filter>

<!-- New -->
<lib-column-filter
  columnName="employee name"
  columnKey="employeeName"
  (filterApplied)="onEmployeeNameFilter($event)">
</lib-column-filter>

<!-- New Department filter -->
<lib-column-filter
  columnName="department"
  columnKey="department"
  (filterApplied)="onDepartmentFilter($event)">
</lib-column-filter>
```

**Update TypeScript:**
```typescript
// Use the same columnKey in utility function that matches HTML
if (this.employeeNameFilter) {
  result = applyColumnFilter(result, 'employeeName', this.employeeNameFilter);
  // ↑ This columnKey should match the one in HTML
}
```

---

## Field Types

This library supports **5 different field types**:

### 1. Text Field (Default)

**Use Case**: Text content like names, emails, descriptions, etc.

**Match Types Available**:
- Match All (all words must be present)
- Match Any (at least one word must be present)
- Starts with
- Ends with
- Contains
- Equals

**Example**:
```html
<lib-column-filter
  columnName="first name"
  columnKey="firstName"
  fieldType="text"
  (filterApplied)="onFilterApplied($event)">
</lib-column-filter>
```

---

### 2. Currency Field

**Use Case**: Currency values like price, balance, amount, etc.

**Match Types Available**:
- Equals
- Greater than
- Less than
- Greater or equal
- Less or equal

**Features**:
- Currency symbol display ($, ₹, €, etc.)
- Automatic number formatting with commas
- Decimal support

**Example**:
```html
<lib-column-filter
  columnName="balance"
  columnKey="balance"
  fieldType="currency"
  currencySymbol="$"
  (filterApplied)="onBalanceFilterApplied($event)">
</lib-column-filter>
```

---

### 3. Age/Number Field

**Use Case**: Simple numeric values like age, quantity, count, ratings, etc.

**Match Types Available**:
- Equals
- Greater than
- Less than
- Greater or equal
- Less or equal

**Features**:
- Simple number input (no currency symbol)
- Integer support
- Easy to use for age, quantity, etc.

**Example**:
```html
<lib-column-filter
  columnName="age"
  columnKey="age"
  fieldType="age"
  (filterApplied)="onAgeFilterApplied($event)">
</lib-column-filter>
```

---

### 4. Date Field

**Use Case**: Date values like created date, due date, birth date, etc.

**Match Types Available**:
- Date is
- Date is not
- Date is before
- Date is after
- Date is on

**Features**:
- Native date picker
- Proper date comparison
- Date normalization for accurate filtering

**Example**:
```html
<lib-column-filter
  columnName="date"
  columnKey="date"
  fieldType="date"
  (filterApplied)="onDateFilterApplied($event)">
</lib-column-filter>
```

---

### 5. Status Field

**Use Case**: Predefined status options like order status, user status, task status, etc.

**Match Types Available**:
- Is
- Is not
- Equals

**Features**:
- Dropdown with predefined options
- Clean UI with select dropdown
- Easy status selection

**Example**:
```html
<lib-column-filter
  columnName="status"
  columnKey="status"
  fieldType="status"
  [statusOptions]="['qualified', 'unqualified', 'negotiation', 'new']"
  (filterApplied)="onStatusFilterApplied($event)">
</lib-column-filter>
```

---

### Complete Example with All Field Types

```typescript
import { Component } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';

interface Employee {
  id: number;
  name: string;
  age: number;
  salary: number;
  joinDate: string;
  status: string;
}

@Component({
  selector: 'app-employee-list',
  imports: [ColumnFilterComponent],
  template: `
    <table>
      <thead>
        <tr>
          <th>
            Name
            <lib-column-filter
              columnName="name"
              columnKey="name"
              fieldType="text"
              (filterApplied)="onNameFilter($event)">
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
            Salary
            <lib-column-filter
              columnName="salary"
              columnKey="salary"
              fieldType="currency"
              currencySymbol="$"
              (filterApplied)="onSalaryFilter($event)">
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
        <tr *ngFor="let emp of filteredEmployees">
          <td>{{ emp.name }}</td>
          <td>{{ emp.age }}</td>
          <td>${{ emp.salary | number }}</td>
          <td>{{ emp.joinDate }}</td>
          <td>{{ emp.status }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class EmployeeListComponent {
  employees: Employee[] = [
    { id: 1, name: 'John Doe', age: 30, salary: 50000, joinDate: '2020-01-15', status: 'active' },
    { id: 2, name: 'Jane Smith', age: 25, salary: 60000, joinDate: '2019-05-20', status: 'active' }
  ];
  
  filteredEmployees: Employee[] = [...this.employees];
  statusOptions = ['active', 'inactive', 'on-leave', 'terminated'];
  
  nameFilter: FilterConfig | null = null;
  ageFilter: FilterConfig | null = null;
  salaryFilter: FilterConfig | null = null;
  dateFilter: FilterConfig | null = null;
  statusFilter: FilterConfig | null = null;

  onNameFilter(filterConfig: FilterConfig) {
    this.nameFilter = filterConfig;
    this.applyAllFilters();
  }

  onAgeFilter(filterConfig: FilterConfig) {
    this.ageFilter = filterConfig;
    this.applyAllFilters();
  }

  onSalaryFilter(filterConfig: FilterConfig) {
    this.salaryFilter = filterConfig;
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

  private applyAllFilters() {
    let result = [...this.employees];

    if (this.nameFilter) {
      result = applyColumnFilter(result, 'name', this.nameFilter);
    }
    if (this.ageFilter) {
      result = applyColumnFilter(result, 'age', this.ageFilter);
    }
    if (this.salaryFilter) {
      result = applyColumnFilter(result, 'salary', this.salaryFilter);
    }
    if (this.dateFilter) {
      result = applyColumnFilter(result, 'joinDate', this.dateFilter);
    }
    if (this.statusFilter) {
      result = applyColumnFilter(result, 'status', this.statusFilter);
    }

    this.filteredEmployees = result;
  }
}
```

---

## Match All Rules Feature

### What is it?

When you add **multiple filter rules**, you can choose how to combine them:
- **Match Any Rule** (default): If any rule matches, the item is included (OR logic)
- **Match All Rules**: All rules must match for the item to be included (AND logic)

### Example:

Let's say you have 2 rules:
- Rule 1: Contains "John"
- Rule 2: Contains "Doe"

#### Match Any Rule (OR Logic):
- ✅ "John Smith" will match (Rule 1 matches)
- ✅ "Jane Doe" will match (Rule 2 matches)
- ✅ "John Doe" will match (both rules match)

#### Match All Rules (AND Logic):
- ❌ "John Smith" won't match (Rule 2 fails)
- ❌ "Jane Doe" won't match (Rule 1 fails)
- ✅ "John Doe" will match (both rules match)

### UI Appearance:

When you add **2 or more rules**, a **"Match All Rules" / "Match Any Rule"** toggle will appear at the top of the dropdown:

- **Green border and light green background**: When "Match All Rules" is selected
- **Normal border**: When "Match Any Rule" is selected (default)

---

## Component API Reference

### Inputs / Input Properties:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `columnName` | `string` | `''` | Display name of the column (used in placeholder) |
| `columnKey` | `string` | `''` | Property name to filter on |
| `fieldType` | `FieldType` | `'text'` | Field type: 'text', 'currency', 'age', 'date', or 'status' |
| `currencySymbol` | `string` | `'$'` | Currency symbol for currency field type (optional) |
| `statusOptions` | `string[]` | `[]` | Array of status options for status field type (required for status) |
| `initialFilter` | `FilterConfig?` | `undefined` | Initial filter configuration (optional) |
| `placeholder` | `string?` | `undefined` | Custom placeholder text. Default: "Search by {columnName}" |
| `availableMatchTypes` | `MatchType[]?` | `undefined` | Customize available match types (optional) |

### Outputs / Output Events:

| Output | Type | Description |
|--------|------|-------------|
| `filterApplied` | `EventEmitter<FilterConfig>` | Emitted when filter is applied |
| `filterCleared` | `EventEmitter<void>` | Emitted when filter is cleared |

### Public Methods:

| Method | Description |
|--------|-------------|
| `clearFilter()` | Programmatically clear all filter rules and reset the filter |

### FilterConfig Interface:

```typescript
type FieldType = 'text' | 'currency' | 'age' | 'date' | 'status';

interface FilterConfig {
  rules: FilterRule[];
  globalMatchMode?: GlobalMatchMode; // 'match-all-rules' | 'match-any-rule'
  fieldType?: FieldType; // Field type for this filter
  statusOptions?: string[]; // Status options (for status field type)
}

interface FilterRule {
  id: string;
  matchType: MatchType;
  value: string;
}

// Match types vary based on field type:
// Text: 'match-all' | 'match-any' | 'starts-with' | 'ends-with' | 'contains' | 'equals'
// Currency/Age: 'equals' | 'greater-than' | 'less-than' | 'greater-equal' | 'less-equal'
// Date: 'is' | 'is-not' | 'is-before' | 'is-after' | 'is-on'
// Status: 'is' | 'is-not' | 'equals'
```

---

## Utility Functions

### applyColumnFilter

Apply filter rules to a dataset:

```typescript
import { applyColumnFilter } from 'ngx-column-filter-popup';

const filteredData = applyColumnFilter(
  data,              // Your data array
  'columnKey',       // Property name to filter on
  filterConfig       // FilterConfig from component
);
```

### itemMatchesFilter

Check if a single item matches filter rules:

```typescript
import { itemMatchesFilter } from 'ngx-column-filter-popup';

const matches = itemMatchesFilter(
  item,              // Single item to check
  'columnKey',       // Property name to filter on
  filterConfig       // FilterConfig from component
);
```

---

## Backend Mode (Backend API Integration)

### What is Backend Mode?

When `backendMode` is enabled, the component **does not apply any frontend filtering**. Instead, it collects all filter values and emits them as a structured payload ready to be sent to your backend API.

### When to Use Backend Mode:

- ✅ When you have large datasets and want server-side filtering
- ✅ When your filtering logic is complex and handled by backend
- ✅ When you need to send filter parameters to a REST API
- ✅ When combining frontend filters (some columns) with backend filters (other columns)

### How to Use Backend Mode:

**1. Enable backend mode on specific columns:**

```html
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
```

**2. Use generic handlers with Map-based storage:**

```typescript
import { Component } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig } from 'ngx-column-filter-popup';

@Component({
  selector: 'app-example',
  imports: [ColumnFilterComponent],
  template: `<!-- HTML from above -->`
})
export class ExampleComponent {
  // Unified filter storage
  filters = new Map<string, FilterConfig | null>();

  // Configuration: Which columns use backend mode
  readonly backendModeColumns = new Set<string>(['firstName', 'email']);

  // Generic filter handler
  onFilterApplied(columnKey: string, filterConfig: FilterConfig) {
    this.filters.set(columnKey, filterConfig);
    
    if (this.isBackendMode(columnKey)) {
      this.sendAllBackendFiltersToBackend();
    }
  }

  onFilterCleared(columnKey: string) {
    this.filters.set(columnKey, null);
    
    if (this.isBackendMode(columnKey)) {
      this.sendAllBackendFiltersToBackend();
    }
  }

  isBackendMode(columnKey: string): boolean {
    return this.backendModeColumns.has(columnKey);
  }

  private sendAllBackendFiltersToBackend() {
    const activeFilters: Array<{
      field: string;
      matchType: string;
      value: string;
      fieldType: string;
    }> = [];

    // Collect all active backend filters
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

    // Send to your backend API
    // this.httpClient.post('/api/filters', payload).subscribe({
    //   next: (response) => {
    //     this.filteredData = response.data;
    //   }
    // });
    
    console.log('Backend payload:', payload);
  }
}
```

### Backend Payload Format:

The component emits filter data in this format:

```json
{
  "activeFilters": [
    {
      "field": "firstName",
      "matchType": "contains",
      "value": "John",
      "fieldType": "text"
    },
    {
      "field": "email",
      "matchType": "contains",
      "value": "example",
      "fieldType": "text"
    }
  ],
  "count": 2
}
```

### Mixed Mode (Frontend + Backend):

You can use both frontend and backend filters together:

```typescript
// Some columns use frontend filtering
<lib-column-filter columnKey="lastName" [backendMode]="false" ...>

// Other columns use backend filtering
<lib-column-filter columnKey="firstName" [backendMode]="true" ...>
```

In `applyAllFilters()`, skip backend mode columns:

```typescript
private applyAllFilters() {
  let result = [...this.originalData];

  this.filters.forEach((filterConfig, columnKey) => {
    // Skip backend mode columns (handled by backend)
    if (filterConfig && !this.isBackendMode(columnKey)) {
      result = applyColumnFilter(result, columnKey, filterConfig);
    }
  });

  this.filteredData = result;
}
```

---

## Programmatic Control

### Clearing Filters Programmatically

You can clear filters programmatically using `ViewChild`:

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
export class ExampleComponent {
  @ViewChild('nameFilter') filter!: ColumnFilterComponent;

  clearFilter() {
    this.filter.clearFilter(); // Programmatically clear the filter
  }
}
```

---

## Important Notes:

1. **Data Type Independence**: Component works with any data type, just ensure `columnKey` is correct.

2. **Case Insensitive**: All filters are case-insensitive (uppercase/lowercase doesn't matter)

3. **Empty Rules**: Empty rules are automatically ignored

4. **Multiple Columns**: You can apply filters on as many columns as you want

5. **Filter Combination**: Filters from multiple columns are combined with **AND logic** (all column filters must match)

6. **Global Match Mode**: This only applies to **multiple rules within one column**, not multiple columns

7. **Single Filter Open**: Only one filter dropdown can be open at a time - opening a new filter closes the previous one automatically

8. **ESC Key**: Press ESC key to close the currently open filter dropdown

---

## Troubleshooting

### Problem: Filter not working
- Check that `columnKey` matches your data object's property name
- Check that `applyColumnFilter` function uses the same `columnKey`

### Problem: "Match All Rules" toggle not showing
- This only appears when you have **2 or more rules**
- Use the "Add Rule" button to add more rules

### Problem: Data not updating after data change
- Remember to update `columnKey` and `columnName` in HTML
- Also update the `columnKey` in `applyColumnFilter` function in TypeScript

---

## Summary

✅ **What it does**: Provides advanced column filtering for tables/lists  
✅ **Data adaptation**: Simply update `columnKey` and `columnName` in HTML  
✅ **Match All Rules**: Feature to combine multiple rules with AND/OR logic  
✅ **Backend Mode**: Send filter payloads directly to backend API  
✅ **Visual Feedback**: Blinking red icon clearly indicates active filters  
✅ **Easy to Use**: Simple API, fully customizable  
✅ **Multiple Field Types**: Support for text, currency, age, date, and status fields  
✅ **Programmatic Control**: Clear filters programmatically  
✅ **Better UX**: Only one filter open at a time, ESC key support  

---

**Made with ❤️ by Shivam Sharma**
