import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service to manage column filter state across multiple filter components
 * Ensures only one filter dropdown is open at a time
 */
@Injectable({
  providedIn: 'root'
})
export class ColumnFilterService {
  private openFilterId = new Subject<string | null>();
  openFilterId$ = this.openFilterId.asObservable();

  /**
   * Notify that a filter is now open
   */
  openFilter(filterId: string): void {
    this.openFilterId.next(filterId);
  }

  /**
   * Notify that a filter is now closed
   */
  closeFilter(filterId: string): void {
    this.openFilterId.next(null);
  }

  /**
   * Close all open filters
   */
  closeAllFilters(): void {
    this.openFilterId.next(null);
  }
}
