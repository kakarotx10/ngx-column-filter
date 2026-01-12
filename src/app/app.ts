import { Component, signal } from '@angular/core';
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

  // Filter configurations
  firstNameFilter: FilterConfig | null = null;
  lastNameFilter: FilterConfig | null = null;
  emailFilter: FilterConfig | null = null;
  roleFilter: FilterConfig | null = null;
  balanceFilter: FilterConfig | null = null;
  dateFilter: FilterConfig | null = null;
  statusFilter: FilterConfig | null = null;

  // Status options for status field
  statusOptions = ['qualified', 'unqualified', 'negotiation', 'new', 'renewal', 'proposal'];

  onFirstNameFilterApplied(filterConfig: FilterConfig) {
    this.firstNameFilter = filterConfig;
    this.applyAllFilters();
  }

  onFirstNameFilterCleared() {
    this.firstNameFilter = null;
    this.applyAllFilters();
  }

  onLastNameFilterApplied(filterConfig: FilterConfig) {
    this.lastNameFilter = filterConfig;
    this.applyAllFilters();
  }

  onLastNameFilterCleared() {
    this.lastNameFilter = null;
    this.applyAllFilters();
  }

  onEmailFilterApplied(filterConfig: FilterConfig) {
    this.emailFilter = filterConfig;
    this.applyAllFilters();
  }

  onEmailFilterCleared() {
    this.emailFilter = null;
    this.applyAllFilters();
  }

  onRoleFilterApplied(filterConfig: FilterConfig) {
    this.roleFilter = filterConfig;
    this.applyAllFilters();
  }

  onRoleFilterCleared() {
    this.roleFilter = null;
    this.applyAllFilters();
  }

  onBalanceFilterApplied(filterConfig: FilterConfig) {
    this.balanceFilter = filterConfig;
    this.applyAllFilters();
  }

  onBalanceFilterCleared() {
    this.balanceFilter = null;
    this.applyAllFilters();
  }

  onDateFilterApplied(filterConfig: FilterConfig) {
    this.dateFilter = filterConfig;
    this.applyAllFilters();
  }

  onDateFilterCleared() {
    this.dateFilter = null;
    this.applyAllFilters();
  }

  onStatusFilterApplied(filterConfig: FilterConfig) {
    this.statusFilter = filterConfig;
    this.applyAllFilters();
  }

  onStatusFilterCleared() {
    this.statusFilter = null;
    this.applyAllFilters();
  }

  private applyAllFilters() {
    let result = [...this.originalData];

    if (this.firstNameFilter) {
      result = applyColumnFilter(result, 'firstName', this.firstNameFilter);
    }

    if (this.lastNameFilter) {
      result = applyColumnFilter(result, 'lastName', this.lastNameFilter);
    }

    if (this.emailFilter) {
      result = applyColumnFilter(result, 'email', this.emailFilter);
    }

    if (this.roleFilter) {
      result = applyColumnFilter(result, 'role', this.roleFilter);
    }

    if (this.balanceFilter) {
      result = applyColumnFilter(result, 'balance', this.balanceFilter);
    }

    if (this.dateFilter) {
      result = applyColumnFilter(result, 'date', this.dateFilter);
    }

    if (this.statusFilter) {
      result = applyColumnFilter(result, 'status', this.statusFilter);
    }

    this.filteredData = result;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.firstNameFilter) count++;
    if (this.lastNameFilter) count++;
    if (this.emailFilter) count++;
    if (this.roleFilter) count++;
    if (this.balanceFilter) count++;
    if (this.dateFilter) count++;
    if (this.statusFilter) count++;
    return count;
  }

  clearAllFilters() {
    this.firstNameFilter = null;
    this.lastNameFilter = null;
    this.emailFilter = null;
    this.roleFilter = null;
    this.balanceFilter = null;
    this.dateFilter = null;
    this.statusFilter = null;
    this.filteredData = [...this.originalData];
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  }
}