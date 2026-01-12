import { FilterRule, FilterConfig, GlobalMatchMode, FieldType } from '../models/filter.models';

/**
 * Apply column filter rules to a dataset
 * @param data - Array of objects to filter
 * @param columnKey - The property name to filter on
 * @param filterConfig - The filter configuration containing rules
 * @returns Filtered array
 */
export function applyColumnFilter<T extends Record<string, any>>(
  data: T[],
  columnKey: string,
  filterConfig: FilterConfig | null | undefined
): T[] {
  if (!filterConfig || !filterConfig.rules || filterConfig.rules.length === 0) {
    return data;
  }

  return data.filter(item => itemMatchesFilter(item, columnKey, filterConfig));
}

/**
 * Check if a single item matches the filter rules
 * @param item - The item to check
 * @param columnKey - The property name to filter on
 * @param filterConfig - The filter configuration containing rules
 * @returns true if the item matches the filter
 */
export function itemMatchesFilter<T extends Record<string, any>>(
  item: T,
  columnKey: string,
  filterConfig: FilterConfig
): boolean {
  if (!filterConfig || !filterConfig.rules || filterConfig.rules.length === 0) {
    return true;
  }

  const value = item[columnKey];
  if (value === null || value === undefined) {
    return false;
  }

  // Filter out empty rules
  const validRules = filterConfig.rules.filter(rule => {
    if (filterConfig.fieldType === 'status') {
      return rule.value !== '';
    }
    return rule.value.trim() !== '';
  });
  
  if (validRules.length === 0) {
    return true;
  }

  const fieldType = filterConfig.fieldType || 'text';
  
  // Check if rule matches based on field type
  const checkRuleMatch = (rule: FilterRule): boolean => {
    if (fieldType === 'currency') {
      return checkCurrencyMatch(value, rule);
    } else if (fieldType === 'age') {
      return checkAgeMatch(value, rule);
    } else if (fieldType === 'date') {
      return checkDateMatch(value, rule);
    } else if (fieldType === 'status') {
      return checkStatusMatch(value, rule);
    } else {
      return checkTextMatch(value, rule);
    }
  };
  
  // Get global match mode (default to 'match-any-rule' for backward compatibility)
  const globalMatchMode: GlobalMatchMode = filterConfig.globalMatchMode || 'match-any-rule';
  
  // Apply global match mode
  if (globalMatchMode === 'match-all-rules') {
    // ALL rules must match (AND logic)
    return validRules.every(rule => checkRuleMatch(rule));
  } else {
    // ANY rule can match (OR logic)
    return validRules.some(rule => checkRuleMatch(rule));
  }
}

/**
 * Check text match based on match type
 */
function checkTextMatch(value: any, rule: FilterRule): boolean {
  const stringValue = String(value).toLowerCase();
  const ruleValue = rule.value.trim().toLowerCase();
  
  switch (rule.matchType) {
    case 'match-all':
      const words = ruleValue.split(/\s+/).filter(w => w.length > 0);
      return words.length > 0 && words.every(word => stringValue.includes(word));
      
    case 'match-any':
      const anyWords = ruleValue.split(/\s+/).filter(w => w.length > 0);
      return anyWords.length > 0 && anyWords.some(word => stringValue.includes(word));
      
    case 'starts-with':
      return stringValue.startsWith(ruleValue);
      
    case 'ends-with':
      return stringValue.endsWith(ruleValue);
      
    case 'contains':
      return stringValue.includes(ruleValue);
      
    case 'equals':
      return stringValue === ruleValue;
      
    default:
      return false;
  }
}

/**
 * Check currency/number match
 */
function checkCurrencyMatch(value: any, rule: FilterRule): boolean {
  // Parse currency values (remove currency symbols and commas)
  const numValue = parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
  const ruleValue = parseFloat(rule.value.replace(/[^0-9.-]/g, '')) || 0;
  
  if (isNaN(numValue) || isNaN(ruleValue)) {
    return false;
  }
  
  switch (rule.matchType) {
    case 'equals':
      return numValue === ruleValue;
      
    case 'greater-than':
      return numValue > ruleValue;
      
    case 'less-than':
      return numValue < ruleValue;
      
    case 'greater-equal':
      return numValue >= ruleValue;
      
    case 'less-equal':
      return numValue <= ruleValue;
      
    default:
      return false;
  }
}

/**
 * Check age/number match (same logic as currency but simpler parsing)
 */
function checkAgeMatch(value: any, rule: FilterRule): boolean {
  // Parse number values
  const numValue = parseFloat(String(value)) || 0;
  const ruleValue = parseFloat(rule.value) || 0;
  
  if (isNaN(numValue) || isNaN(ruleValue)) {
    return false;
  }
  
  switch (rule.matchType) {
    case 'equals':
      return numValue === ruleValue;
      
    case 'greater-than':
      return numValue > ruleValue;
      
    case 'less-than':
      return numValue < ruleValue;
      
    case 'greater-equal':
      return numValue >= ruleValue;
      
    case 'less-equal':
      return numValue <= ruleValue;
      
    default:
      return false;
  }
}

/**
 * Check date match
 */
function checkDateMatch(value: any, rule: FilterRule): boolean {
  const dateValue = new Date(value);
  const ruleDate = new Date(rule.value);
  
  if (isNaN(dateValue.getTime()) || isNaN(ruleDate.getTime())) {
    return false;
  }
  
  // Normalize dates to midnight for comparison
  const normalizedValue = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
  const normalizedRule = new Date(ruleDate.getFullYear(), ruleDate.getMonth(), ruleDate.getDate());
  
  switch (rule.matchType) {
    case 'is':
    case 'is-on':
      return normalizedValue.getTime() === normalizedRule.getTime();
      
    case 'is-not':
      return normalizedValue.getTime() !== normalizedRule.getTime();
      
    case 'is-before':
      return normalizedValue.getTime() < normalizedRule.getTime();
      
    case 'is-after':
      return normalizedValue.getTime() > normalizedRule.getTime();
      
    default:
      return false;
  }
}

/**
 * Check status match
 */
function checkStatusMatch(value: any, rule: FilterRule): boolean {
  const stringValue = String(value).toLowerCase().trim();
  const ruleValue = rule.value.toLowerCase().trim();
  
  switch (rule.matchType) {
    case 'is':
    case 'equals':
      return stringValue === ruleValue;
      
    case 'is-not':
      return stringValue !== ruleValue;
      
    default:
      return stringValue === ruleValue;
  }
}