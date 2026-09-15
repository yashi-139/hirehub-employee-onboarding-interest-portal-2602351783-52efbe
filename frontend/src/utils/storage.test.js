import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SUBMISSIONS_STORAGE_KEY,
  addSubmission,
  deleteSubmission,
  getSubmissions,
  isEmailDuplicate,
  saveSubmissions,
  updateSubmission,
} from './storage';

const firstSubmission = {
  id: 'record-1',
  fullName: 'Ava Smith',
  email: 'ava@example.com',
  mobile: '1234567890',
  department: 'Engineering',
  submittedAt: '2026-03-04T12:00:00.000Z',
};

describe('submission storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty collection when storage is absent', () => {
    expect(getSubmissions()).toEqual([]);
  });

  it('saves and returns submission arrays', () => {
    saveSubmissions([firstSubmission]);
    expect(getSubmissions()).toEqual([firstSubmission]);
  });

  it('resets malformed and non-array JSON to an empty persisted array', () => {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, '{bad json');
    expect(getSubmissions()).toEqual([]);
    expect(localStorage.getItem(SUBMISSIONS_STORAGE_KEY)).toBe('[]');

    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify({ record: firstSubmission }));
    expect(getSubmissions()).toEqual([]);
    expect(localStorage.getItem(SUBMISSIONS_STORAGE_KEY)).toBe('[]');
  });

  it('adds a record and blocks case-insensitive duplicate emails without writing', () => {
    expect(addSubmission(firstSubmission)).toBe(true);
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    expect(addSubmission({ ...firstSubmission, id: 'record-2', email: ' AVA@EXAMPLE.COM ' })).toBe(false);
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(getSubmissions()).toEqual([firstSubmission]);
    setItemSpy.mockRestore();
  });

  it('detects email duplicates case-insensitively and accepts different or non-string candidates', () => {
    saveSubmissions([firstSubmission]);
    expect(isEmailDuplicate('AVA@example.com')).toBe(true);
    expect(isEmailDuplicate('  ava@example.com  ')).toBe(true);
    expect(isEmailDuplicate('other@example.com')).toBe(false);
    expect(isEmailDuplicate(null)).toBe(false);
  });

  it('updates only a matching record and leaves unknown IDs untouched', () => {
    saveSubmissions([firstSubmission]);
    expect(updateSubmission('record-1', { mobile: '0987654321', department: 'Design' })).toBe(true);
    expect(getSubmissions()).toEqual([
      { ...firstSubmission, mobile: '0987654321', department: 'Design' },
    ]);
    expect(updateSubmission('missing', { mobile: '1111111111' })).toBe(false);
  });

  it('deletes only a matching record and leaves unknown IDs untouched', () => {
    saveSubmissions([firstSubmission]);
    expect(deleteSubmission('missing')).toBe(false);
    expect(deleteSubmission('record-1')).toBe(true);
    expect(getSubmissions()).toEqual([]);
  });
});
