import { describe, it, expect } from 'vitest';

const canAdd = (userType) => userType === 'ADMIN' || userType === 'SUPERADMIN';
const canEdit = (userType) => userType === 'ADMIN' || userType === 'SUPERADMIN';
const canDelete = (userType) => userType === 'SUPERADMIN';
const canSeeAdmin = (userType) => userType === 'ADMIN' || userType === 'SUPERADMIN';

// Decision 6 (2026-05-09): Only SUPERADMIN holds ADM_USER.
// ADMIN can enter the Admin Panel but is denied the User Management (Users) tab.
const canSeeUsersTab = (userType) => userType === 'SUPERADMIN';
const canChangeUserRole = (userType) => userType === 'SUPERADMIN';

describe('RBAC access gates (user_type based)', () => {
  it('SUPERADMIN can Add, Edit, Delete', () => {
    expect(canAdd('SUPERADMIN')).toBe(true);
    expect(canEdit('SUPERADMIN')).toBe(true);
    expect(canDelete('SUPERADMIN')).toBe(true);
  });

  it('ADMIN can Add and Edit but NOT Delete', () => {
    expect(canAdd('ADMIN')).toBe(true);
    expect(canEdit('ADMIN')).toBe(true);
    expect(canDelete('ADMIN')).toBe(false);
  });

  it('USER cannot Add, Edit, or Delete', () => {
    expect(canAdd('USER')).toBe(false);
    expect(canEdit('USER')).toBe(false);
    expect(canDelete('USER')).toBe(false);
  });

  it('Admin sidebar visible for ADMIN and SUPERADMIN, hidden for USER', () => {
    expect(canSeeAdmin('ADMIN')).toBe(true);
    expect(canSeeAdmin('SUPERADMIN')).toBe(true);
    expect(canSeeAdmin('USER')).toBe(false);
  });

  it('Users tab in Admin Panel is restricted to SUPERADMIN — ADMIN is denied (Decision 6)', () => {
    expect(canSeeUsersTab('SUPERADMIN')).toBe(true);
    expect(canSeeUsersTab('ADMIN')).toBe(false);
    expect(canSeeUsersTab('USER')).toBe(false);
  });

  it('changeUserRole is only permitted for SUPERADMIN', () => {
    expect(canChangeUserRole('SUPERADMIN')).toBe(true);
    expect(canChangeUserRole('ADMIN')).toBe(false);
    expect(canChangeUserRole('USER')).toBe(false);
  });
});
