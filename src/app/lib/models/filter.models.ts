/**
 * Field type for different column types
 */
export type FieldType = 'text' | 'currency' | 'date' | 'status' | 'age';

/**
 * Match type options for filtering
 */
export type MatchType = 'match-all' | 'match-any' | 'starts-with' | 'ends-with' | 'contains' | 'equals' | 'greater-than' | 'less-than' | 'greater-equal' | 'less-equal' | 'is-before' | 'is-after' | 'is-on' | 'is-not' | 'is';

/**
 * Individual filter rule
 */
export interface FilterRule {
  id: string;
  matchType: MatchType;
  value: string;
}

/**
 * Global match mode for combining multiple filter rules
 */
export type GlobalMatchMode = 'match-all-rules' | 'match-any-rule';

/**
 * Filter configuration containing multiple rules
 */
export interface FilterConfig {
  rules: FilterRule[];
  /**
   * Global match mode: 'match-all-rules' means ALL rules must match (AND logic),
   * 'match-any-rule' means ANY rule can match (OR logic). Default is 'match-any-rule'.
   */
  globalMatchMode?: GlobalMatchMode;
  /**
   * Field type for this column filter
   */
  fieldType?: FieldType;
  /**
   * Status options (for status field type)
   */
  statusOptions?: string[];
}

/**
 * Match type configuration for UI
 */
export interface MatchTypeOption {
  value: MatchType;
  label: string;
}