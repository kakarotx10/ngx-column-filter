# Column Filter Library

A powerful, reusable Angular column filter component with support for multiple field types, advanced filtering rules, and customizable match modes.

[![npm version](https://badge.fury.io/js/ngx-column-filter-popup.svg)](https://www.npmjs.com/package/ngx-column-filter-popup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/kakarotx10/ngx-column-filter.svg?style=social&label=Star)](https://github.com/kakarotx10/ngx-column-filter)
[![GitHub forks](https://img.shields.io/github/forks/kakarotx10/ngx-column-filter.svg?style=social&label=Fork)](https://github.com/kakarotx10/ngx-column-filter)

## 🚀 Quick Links

- 🎯 [Live Demo](https://ngx-column-filter.netlify.app/) - See it in action!
- 📦 [NPM Package](https://www.npmjs.com/package/ngx-column-filter-popup)
- 🏠 [GitHub Repository](https://github.com/kakarotx10/ngx-column-filter)

## 📚 Documentation & Guides

**New to this library?** Start here:

- 📖 **[Getting Started Tutorial](./GETTING_STARTED.md)** ⭐ - **Complete step-by-step guide: How to install, import, and use**
  - Installation steps
  - TypeScript imports explained
  - Basic and advanced examples
  - All field types with code samples
  - Data filtering implementation
  - Troubleshooting guide

**More Resources:**

- 📘 [Complete Documentation](./DOCUMENTATION.md) - Full API reference, all features explained
- 💡 [Usage Examples](./USAGE_EXAMPLES.md) - Advanced usage patterns and programmatic control
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - How to deploy your Angular app

## 🐛 Support

- 🐛 [Report Bug](https://github.com/kakarotx10/ngx-column-filter/issues)
- 💬 [Request Feature](https://github.com/kakarotx10/ngx-column-filter/issues)

## Features

- ✅ **Multiple Filter Rules**: Add multiple filter conditions per column
- ✅ **Multiple Field Types**: Specialized filters for different data types
  - **Text** - Text fields (default)
  - **Currency** - Currency values with symbol support
  - **Age/Number** - Numeric values
  - **Date** - Date values with date picker
  - **Status** - Predefined status options dropdown
- ✅ **Global Match Mode**: Choose how to combine multiple rules
  - **Match All Rules** (AND Logic): All rules must match
  - **Match Any Rule** (OR Logic): Any rule can match (default)
- ✅ **Various Match Types**: Different matching options based on field type
- ✅ **Visual Feedback**: Filter icon changes when active
- ✅ **Single Filter Open**: Only one filter dropdown can be open at a time
- ✅ **ESC Key Support**: Press ESC to close the open filter
- ✅ **Programmatic Control**: Clear filters programmatically using `clearFilter()` method
- ✅ **Type-Safe**: Fully typed with TypeScript
- ✅ **Standalone Component**: Works with Angular 14+ standalone components
- ✅ **Fully Customizable**: Configurable inputs for customization
- ✅ **Accessible**: ARIA labels and keyboard navigation support
- ✅ **Data Adaptive**: Simply update `columnKey` and `columnName` when your data changes

## Installation

```bash
npm install ngx-column-filter-popup
```

**Note**: This package is published with TypeScript source files. Make sure your Angular project has TypeScript configured to compile these files.

> 💡 **New to this library?** Check out the **[Getting Started Tutorial](./GETTING_STARTED.md)** for a complete step-by-step guide with examples!

## Quick Start

### Standalone Component (Angular 14+)

```typescript
import { Component } from '@angular/core';
import { ColumnFilterComponent } from 'ngx-column-filter-popup';
import { FilterConfig, applyColumnFilter } from 'ngx-column-filter-popup';

@Component({
  selector: 'app-example',
  imports: [ColumnFilterComponent],
  template: `
    <lib-column-filter
      columnName="first name"
      columnKey="firstName"
      (filterApplied)="onFilterApplied($event)"
      (filterCleared)="onFilterCleared()">
    </lib-column-filter>
  `
})
export class ExampleComponent {
  onFilterApplied(filterConfig: FilterConfig) {
    console.log('Filter applied:', filterConfig);
    // Apply filter to your data
  }

  onFilterCleared() {
    console.log('Filter cleared');
    // Clear filter from your data
  }
}
```

### Module-Based (Optional)

```typescript
import { NgModule } from '@angular/core';
import { ColumnFilterModule } from 'ngx-column-filter-popup';

@NgModule({
  imports: [ColumnFilterModule],
  // ...
})
export class YourModule {}
```

## Field Types

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
  (filterApplied)="onBalanceFilter($event)">
</lib-column-filter>
```

### Age/Number Field

```html
<lib-column-filter
  columnName="age"
  columnKey="age"
  fieldType="age"
  (filterApplied)="onAgeFilter($event)">
</lib-column-filter>
```

### Date Field

```html
<lib-column-filter
  columnName="date"
  columnKey="date"
  fieldType="date"
  (filterApplied)="onDateFilter($event)">
</lib-column-filter>
```

### Status Field

```html
<lib-column-filter
  columnName="status"
  columnKey="status"
  fieldType="status"
  [statusOptions]="['qualified', 'unqualified', 'negotiation', 'new']"
  (filterApplied)="onStatusFilter($event)">
</lib-column-filter>
```

## API Reference

### ColumnFilterComponent

#### Inputs

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

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `filterApplied` | `EventEmitter<FilterConfig>` | Emitted when filter is applied |
| `filterCleared` | `EventEmitter<void>` | Emitted when filter is cleared |

#### Public Methods

| Method | Description |
|--------|-------------|
| `clearFilter()` | Programmatically clear all filter rules and reset the filter |

### FilterConfig Interface

```typescript
type FieldType = 'text' | 'currency' | 'age' | 'date' | 'status';

interface FilterConfig {
  rules: FilterRule[];
  globalMatchMode?: GlobalMatchMode; // 'match-all-rules' | 'match-any-rule'
  fieldType?: FieldType;
  statusOptions?: string[];
}

interface FilterRule {
  id: string;
  matchType: MatchType;
  value: string;
}
```

### Utility Functions

#### applyColumnFilter

Apply filter rules to a dataset:

```typescript
import { applyColumnFilter } from 'ngx-column-filter-popup';

const filteredData = applyColumnFilter(
  data,
  'columnKey',
  filterConfig
);
```

#### itemMatchesFilter

Check if a single item matches filter rules:

```typescript
import { itemMatchesFilter } from 'ngx-column-filter-popup';

const matches = itemMatchesFilter(
  item,
  'columnKey',
  filterConfig
);
```

## Programmatic Control

### Clearing Filters Programmatically

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

## Complete Example

```typescript
import { Component } from '@angular/core';
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
  `
})
export class UserListComponent {
  users: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', age: 30, balance: 50000, joinDate: '2020-01-15', status: 'active' }
  ];
  
  filteredUsers: User[] = [...this.users];
  statusOptions = ['active', 'inactive', 'on-leave'];
  
  firstNameFilter: FilterConfig | null = null;
  ageFilter: FilterConfig | null = null;
  balanceFilter: FilterConfig | null = null;
  dateFilter: FilterConfig | null = null;
  statusFilter: FilterConfig | null = null;

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

## 📖 Documentation

### For Beginners:
- **[Getting Started Tutorial](./GETTING_STARTED.md)** - Step-by-step guide with examples
  - What to import in TypeScript
  - How to setup component
  - Complete working examples
  - Common patterns

### For Advanced Users:
- **[Complete Documentation](./DOCUMENTATION.md)** - Full API reference
  - All inputs and outputs
  - Utility functions
  - Type definitions
  - Match modes explained
  - Data structure adaptation

- **[Usage Examples](./USAGE_EXAMPLES.md)** - Advanced patterns
  - Programmatic filter control
  - Multiple filters management
  - Custom configurations

- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy your Angular app
  - GitHub Pages
  - Vercel
  - Netlify
  - Firebase Hosting

## Styling

The component uses SCSS and includes default styles. You can customize the appearance by overriding CSS classes:

- `.column-filter-wrapper` - Main wrapper
- `.filter-trigger` - Filter button
- `.filter-dropdown` - Dropdown container
- `.filter-rule` - Individual filter rule
- `.btn-apply` - Apply button
- `.btn-clear` - Clear button

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Requirements

- Angular 14+
- TypeScript 4.7+

## License

MIT

## Author

Made with ❤️ by Shivam Sharma

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
