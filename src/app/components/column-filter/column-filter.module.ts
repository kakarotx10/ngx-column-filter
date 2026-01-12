import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnFilterComponent } from './column-filter.component';

/**
 * Module for Column Filter Component
 * 
 * This module provides the ColumnFilterComponent for use in Angular applications
 * that prefer module-based imports over standalone components.
 * 
 * @example
 * ```typescript
 * import { ColumnFilterModule } from './components/column-filter/column-filter.module';
 * 
 * @NgModule({
 *   imports: [ColumnFilterModule],
 *   // ...
 * })
 * export class YourModule {}
 * ```
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ColumnFilterComponent // Standalone component can be imported in module
  ],
  exports: [ColumnFilterComponent]
})
export class ColumnFilterModule { }