import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FilterRule, FilterConfig, MatchType, MatchTypeOption, GlobalMatchMode, FieldType } from '../../lib/models/filter.models';
import { ColumnFilterService } from '../../lib/services/column-filter.service';

@Component({
  selector: 'lib-column-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss']
})
export class ColumnFilterComponent implements OnInit, OnDestroy {
  /**
   * Display name of the column (used in placeholder text)
   */
  @Input() columnName: string = '';

  /**
   * Optional: Key identifier for the column (can be used by parent component)
   */
  @Input() columnKey: string = '';

  /**
   * Optional: Initial filter configuration
   */
  @Input() initialFilter?: FilterConfig;

  /**
   * Optional: Custom placeholder text. If not provided, uses "Search by {columnName}"
   */
  @Input() placeholder?: string;

  /**
   * Optional: Customize available match types. If not provided, uses all default match types.
   */
  @Input() availableMatchTypes?: MatchType[];

  /**
   * Field type: 'text', 'currency', 'date', or 'status'
   */
  @Input() fieldType: FieldType = 'text';

  /**
   * Status options for status field type
   */
  @Input() statusOptions: string[] = [];

  /**
   * Currency symbol (default: '$')
   */
  @Input() currencySymbol: string = '$';

  /**
   * Backend mode: when true, component only emits filter data without applying frontend filtering.
   * The emitted FilterConfig is ready to be sent directly to a backend API.
   * When false, existing frontend filtering behavior continues as-is.
   */
  @Input() backendMode: boolean = false;

  /**
   * Allow multiple rules: when true, users can add/remove multiple filter rules.
   * When false, only a single rule is allowed (Add Rule and Remove Rule buttons are hidden).
   */
  @Input() allowMultipleRules: boolean = true;

  /**
   * Emitted when filter is applied with the filter configuration
   */
  @Output() filterApplied = new EventEmitter<FilterConfig>();

  /**
   * Emitted when filter is cleared
   */
  @Output() filterCleared = new EventEmitter<void>();

  /**
   * Controls dropdown visibility
   */
  showDropdown = false;

  /**
   * Unique ID for this filter instance
   */
  private filterId: string;

  /**
   * Subscription to filter service
   */
  private filterServiceSubscription?: Subscription;

  /**
   * Array of filter rules
   */
  filterRules: FilterRule[] = [];

  /**
   * Global match mode: how to combine multiple rules
   */
  globalMatchMode: GlobalMatchMode = 'match-any-rule';

  /**
   * Default match types for text fields
   */
  private textMatchTypes: MatchTypeOption[] = [
    { value: 'match-all', label: 'Match All' },
    { value: 'match-any', label: 'Match Any' },
    { value: 'starts-with', label: 'Starts with' },
    { value: 'ends-with', label: 'Ends with' },
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' }
  ];

  /**
   * Match types for currency/number fields
   */
  private currencyMatchTypes: MatchTypeOption[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater-than', label: 'Greater than' },
    { value: 'less-than', label: 'Less than' },
    { value: 'greater-equal', label: 'Greater or equal' },
    { value: 'less-equal', label: 'Less or equal' }
  ];

  /**
   * Match types for age/number fields (same as currency)
   */
  private ageMatchTypes: MatchTypeOption[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater-than', label: 'Greater than' },
    { value: 'less-than', label: 'Less than' },
    { value: 'greater-equal', label: 'Greater or equal' },
    { value: 'less-equal', label: 'Less or equal' }
  ];

  /**
   * Match types for date fields
   */
  private dateMatchTypes: MatchTypeOption[] = [
    { value: 'is', label: 'Date is' },
    { value: 'is-not', label: 'Date is not' },
    { value: 'is-before', label: 'Date is before' },
    { value: 'is-after', label: 'Date is after' },
    { value: 'is-on', label: 'Date is on' }
  ];

  /**
   * Match types for status fields
   */
  private statusMatchTypes: MatchTypeOption[] = [
    { value: 'is', label: 'Is' },
    { value: 'is-not', label: 'Is not' },
    { value: 'equals', label: 'Equals' }
  ];

  /**
   * Getter for match types based on field type
   */
  get matchTypes(): MatchTypeOption[] {
    // If custom match types provided, use those
    if (this.availableMatchTypes && this.availableMatchTypes.length > 0) {
      const allTypes = [...this.textMatchTypes, ...this.currencyMatchTypes, ...this.dateMatchTypes, ...this.statusMatchTypes];
      return allTypes.filter(type => 
        this.availableMatchTypes!.includes(type.value)
      );
    }

    // Return match types based on field type
    switch (this.fieldType) {
      case 'currency':
        return this.currencyMatchTypes;
      case 'age':
        return this.ageMatchTypes;
      case 'date':
        return this.dateMatchTypes;
      case 'status':
        return this.statusMatchTypes;
      case 'text':
      default:
        return this.textMatchTypes;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private filterService: ColumnFilterService
  ) {
    // Generate unique ID for this filter instance
    this.filterId = `filter-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    // Initialize with one default rule
    this.addRule();
  }

  /**
   * Lifecycle hook: Initialize with initial filter if provided
   */
  ngOnInit() {
    if (this.initialFilter && this.initialFilter.rules && this.initialFilter.rules.length > 0) {
      this.filterRules = [...this.initialFilter.rules];
      // Validate match types for each rule
      this.filterRules.forEach(rule => {
        const availableTypes = this.matchTypes;
        if (availableTypes.length > 0) {
          const typeExists = availableTypes.some(type => type.value === rule.matchType);
          if (!typeExists) {
            rule.matchType = availableTypes[0].value as MatchType;
          }
        }
      });
    } else {
      // Ensure we have at least one rule with valid default match type
      if (this.filterRules.length === 0) {
        this.addRule();
      } else {
        // Validate existing rule's match type
        const rule = this.filterRules[0];
        const availableTypes = this.matchTypes;
        if (availableTypes.length > 0) {
          const typeExists = availableTypes.some(type => type.value === rule.matchType);
          if (!typeExists) {
            rule.matchType = availableTypes[0].value as MatchType;
          }
        }
      }
    }
    if (this.initialFilter?.globalMatchMode) {
      this.globalMatchMode = this.initialFilter.globalMatchMode;
    }

    // Subscribe to filter service to handle only one filter open at a time
    this.filterServiceSubscription = this.filterService.openFilterId$.subscribe((openFilterId: string | null) => {
      if (openFilterId !== null && openFilterId !== this.filterId && this.showDropdown) {
        this.showDropdown = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    if (this.filterServiceSubscription) {
      this.filterServiceSubscription.unsubscribe();
    }
  }

  /**
   * Close dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.showDropdown) {
        this.showDropdown = false;
        this.filterService.closeFilter(this.filterId);
      }
    }
  }

  /**
   * Close dropdown on ESC key press
   */
  @HostListener('document:keydown', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showDropdown) {
      this.showDropdown = false;
      this.filterService.closeFilter(this.filterId);
      this.cdr.detectChanges();
    }
  }

  /**
   * Toggle dropdown visibility
   */
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    const newState = !this.showDropdown;
    this.showDropdown = newState;
    
    // Notify service about filter state change
    if (newState) {
      this.filterService.openFilter(this.filterId);
    } else {
      this.filterService.closeFilter(this.filterId);
    }
  }

  /**
   * Add a new filter rule
   */
  addRule(): void {
    let defaultMatchType: MatchType = 'contains';
    if (this.fieldType === 'currency' || this.fieldType === 'age') {
      defaultMatchType = 'equals';
    } else if (this.fieldType === 'date') {
      defaultMatchType = 'is';
    } else if (this.fieldType === 'status') {
      defaultMatchType = 'is';
    }

    // Ensure default match type is valid from available match types
    const availableTypes = this.matchTypes;
    if (availableTypes.length > 0) {
      // Check if default type exists in available types, otherwise use first one
      const typeExists = availableTypes.some(type => type.value === defaultMatchType);
      if (!typeExists) {
        defaultMatchType = availableTypes[0].value as MatchType;
      }
    }

    this.filterRules.push({
      id: this.generateId(),
      matchType: defaultMatchType,
      value: ''
    });
  }

  /**
   * Remove a filter rule at the given index
   */
  removeRule(index: number): void {
    if (this.filterRules.length > 1) {
      this.filterRules.splice(index, 1);
    }
  }

  /**
   * Apply the filter and emit the filter configuration
   * In backendMode: emits filter data ready for backend API (no frontend filtering applied)
   * In frontend mode: emits filter configuration for local filtering
   */
  applyFilter(): void {
    // Filter out empty rules
    const validRules = this.filterRules.filter(rule => {
      if (this.fieldType === 'status') {
        return rule.value !== '';
      }
      return rule.value.trim() !== '';
    });

    if (validRules.length > 0) {
      // Create clean, structured payload ready for backend API
      const filterPayload: FilterConfig = {
        rules: validRules.map(rule => ({
          id: rule.id,
          matchType: rule.matchType,
          value: rule.value.trim()
        })),
        globalMatchMode: this.globalMatchMode,
        fieldType: this.fieldType,
        statusOptions: this.statusOptions.length > 0 ? this.statusOptions : undefined
      };

      // Emit filter configuration
      // When backendMode is true, parent should send this payload to backend API
      // When backendMode is false, parent should use this for local filtering
      this.filterApplied.emit(filterPayload);
    }
    this.showDropdown = false;
    this.filterService.closeFilter(this.filterId);
  }

  /**
   * Clear all filter rules and emit clear event
   * This method can be called programmatically from parent components
   * Resets filter to initial state and updates UI icon accordingly
   */
  clearFilter(): void {
    // Get default match type for this field type
    let defaultMatchType: MatchType = 'contains';
    if (this.fieldType === 'currency' || this.fieldType === 'age') {
      defaultMatchType = 'equals';
    } else if (this.fieldType === 'date') {
      defaultMatchType = 'is';
    } else if (this.fieldType === 'status') {
      defaultMatchType = 'is';
    }

    // Ensure default match type is valid from available match types
    const availableTypes = this.matchTypes;
    if (availableTypes.length > 0) {
      const typeExists = availableTypes.some(type => type.value === defaultMatchType);
      if (!typeExists) {
        defaultMatchType = availableTypes[0].value as MatchType;
      }
    }

    // Create completely new array with one empty rule to ensure UI properly resets
    // Using array literal assignment forces Angular to re-render all inputs
    // IMPORTANT: Empty string value ensures hasActiveFilter() returns false
    this.filterRules = [{
      id: this.generateId(),
      matchType: defaultMatchType,
      value: '' // Empty value ensures hasActiveFilter() returns false
    }];
    
    // Reset global match mode to default
    this.globalMatchMode = 'match-any-rule';
    
    // Close dropdown if open FIRST (before emitting events)
    this.showDropdown = false;
    this.filterService.closeFilter(this.filterId);
    
    // Force change detection BEFORE emitting to ensure UI updates
    // This ensures hasActiveFilter() returns false and icon switches from blinking red to normal gray
    this.cdr.detectChanges();
    
    // Emit clear event to notify parent component AFTER UI update
    this.filterCleared.emit();
    
    // Additional change detection after emit to ensure icon updates
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  /**
   * Toggle global match mode
   */
  toggleGlobalMatchMode(): void {
    this.globalMatchMode = this.globalMatchMode === 'match-any-rule' 
      ? 'match-all-rules' 
      : 'match-any-rule';
  }

  /**
   * Check if there are any active filters (non-empty rules)
   */
  hasActiveFilter(): boolean {
    if (!this.filterRules || this.filterRules.length === 0) {
      return false;
    }
    return this.filterRules.some(rule => {
      if (!rule || !rule.value) {
        return false;
      }
      // For status fields, check if value is not empty string
      if (this.fieldType === 'status') {
        return rule.value.trim() !== '';
      }
      // For other fields, check if trimmed value is not empty
      return rule.value.trim() !== '';
    });
  }

  /**
   * Get placeholder text for the input field
   */
  getPlaceholder(): string {
    if (this.placeholder) {
      return this.placeholder;
    }
    return this.columnName ? `Search by ${this.columnName.toLowerCase()}` : 'Search';
  }

  /**
   * Get label for a match type value
   */
  getMatchTypeLabel(value: MatchType): string {
    const type = this.matchTypes.find(t => t.value === value);
    return type ? type.label : '';
  }

  /**
   * Check if there are multiple rules (to show global match mode toggle)
   */
  hasMultipleRules(): boolean {
    return this.filterRules.length > 1;
  }

  /**
   * Get label for global match mode
   */
  getGlobalMatchModeLabel(): string {
    return this.globalMatchMode === 'match-all-rules' ? 'Match All Rules' : 'Match Any Rule';
  }

  /**
   * Format currency value for display
   */
  formatCurrency(value: string): string {
    if (!value || value.trim() === '') return '';
    const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    if (isNaN(numValue)) return value;
    // Format with currency symbol and commas, but don't add decimals if not present
    const formatted = numValue.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
    return this.currencySymbol + formatted;
  }

  /**
   * Parse currency value from formatted string
   */
  parseCurrency(value: string): string {
    // Remove currency symbol and commas, keep numbers and decimal point
    return value.replace(/[^0-9.-]/g, '');
  }

  /**
   * Check if field type is status
   */
  isStatusField(): boolean {
    return this.fieldType === 'status';
  }

  /**
   * Check if field type is currency
   */
  isCurrencyField(): boolean {
    return this.fieldType === 'currency';
  }

  /**
   * Check if field type is age
   */
  isAgeField(): boolean {
    return this.fieldType === 'age';
  }

  /**
   * Check if field type is date
   */
  isDateField(): boolean {
    return this.fieldType === 'date';
  }

  /**
   * Check if field type is text
   */
  isTextField(): boolean {
    return this.fieldType === 'text';
  }

  /**
   * Generate a unique ID for a filter rule
   */
  private generateId(): string {
    return `rule-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}