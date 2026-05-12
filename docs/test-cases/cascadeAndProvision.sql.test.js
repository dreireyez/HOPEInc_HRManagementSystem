import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p) => readFileSync(resolve(__dirname, '..', '..', p), 'utf8');

describe('migration 012 — sepdate trigger + cascade rename', () => {
  const sql = read('db/migrations/012_sepdate_and_stamp_formats.sql');

  it('renames the cascade function to cascade_employee_soft_delete', () => {
    expect(sql).toMatch(/CREATE FUNCTION cascade_employee_soft_delete\(\)/);
  });

  it('emits CASCADE-DEL stamps with the empno included', () => {
    expect(sql).toContain("'CASCADE-DEL ' || NEW.empno");
  });

  it('emits CASCADE-RECOVER stamps with the empno included', () => {
    expect(sql).toContain("'CASCADE-RECOVER ' || NEW.empno");
  });

  it('installs the sepdate BEFORE-UPDATE trigger', () => {
    expect(sql).toMatch(/CREATE TRIGGER sepdate_softdelete\s+BEFORE UPDATE ON employee/);
  });

  it('does NOT alter the stamp column width (varchar(60) is locked by spec)', () => {
    expect(sql).not.toMatch(/ALTER\s+COLUMN\s+stamp/i);
  });
});

describe('migration 013 — idempotent rights backfill', () => {
  const sql = read('db/migrations/013_rights_backfill_idempotent.sql');

  it('seeds USER with all four *_VIEW rights = 1', () => {
    expect(sql).toMatch(/'EMP_VIEW','JH_VIEW','JOB_VIEW','DEPT_VIEW'/);
  });

  it('grants SUPERADMIN every right (CROSS JOIN with right_value = 1)', () => {
    expect(sql).toMatch(/CROSS JOIN rights r[\s\S]*WHERE u\.user_type = 'SUPERADMIN'/);
  });

  it('uses ON CONFLICT DO UPDATE so the script is safe to re-run', () => {
    const matches = sql.match(/ON CONFLICT \(userId, right_id\) DO UPDATE/g) || [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });
});
