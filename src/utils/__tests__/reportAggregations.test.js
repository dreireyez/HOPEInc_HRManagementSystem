import { describe, it, expect } from 'vitest';
import { 
  getHeadcount, 
  getDeptName, 
  calculateTotalHeadcount, 
  calculateHeadcountPercentage 
} from '../reportAggregations';

describe('reportAggregations', () => {
  describe('getHeadcount', () => {
    it('returns activeheadcount if present', () => {
      expect(getHeadcount({ activeheadcount: 5, headcount: 10 })).toBe(5);
    });

    it('returns headcount if activeheadcount is missing', () => {
      expect(getHeadcount({ headcount: 10 })).toBe(10);
    });

    it('returns count if both activeheadcount and headcount are missing', () => {
      expect(getHeadcount({ count: 15 })).toBe(15);
    });

    it('returns 0 if no count properties are present', () => {
      expect(getHeadcount({ other: 'value' })).toBe(0);
    });
  });

  describe('getDeptName', () => {
    it('returns deptname if present', () => {
      expect(getDeptName({ deptname: 'Engineering', dept_name: 'Sales' })).toBe('Engineering');
    });

    it('returns dept_name if deptname is missing', () => {
      expect(getDeptName({ dept_name: 'Sales' })).toBe('Sales');
    });

    it('returns Unknown if no dept name property is present', () => {
      expect(getDeptName({ id: 1 })).toBe('Unknown');
    });
  });

  describe('calculateTotalHeadcount', () => {
    it('calculates the total correctly across an array of objects', () => {
      const data = [
        { activeheadcount: 5 },
        { headcount: 10 },
        { count: 15 },
        { none: 0 }
      ];
      expect(calculateTotalHeadcount(data)).toBe(30);
    });

    it('returns 0 for empty array', () => {
      expect(calculateTotalHeadcount([])).toBe(0);
    });
  });

  describe('calculateHeadcountPercentage', () => {
    it('calculates correctly and returns a string with 1 decimal place', () => {
      expect(calculateHeadcountPercentage(5, 20)).toBe('25.0');
      expect(calculateHeadcountPercentage(1, 3)).toBe('33.3');
    });

    it('handles totalHeadcount of 0 safely', () => {
      expect(calculateHeadcountPercentage(0, 0)).toBe('0.0');
      expect(calculateHeadcountPercentage(5, 0)).toBe('0.0');
    });
  });
});
