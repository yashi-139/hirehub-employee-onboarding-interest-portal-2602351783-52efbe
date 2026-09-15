import { describe, expect, it } from 'vitest';
import {
  DEPARTMENTS,
  hasValidationErrors,
  validateDepartment,
  validateEmail,
  validateFullName,
  validateMobile,
  validateSubmission,
} from './validators';

describe('candidate submission validators', () => {
  it('accepts valid values including a 100-character name and every listed department', () => {
    expect(validateFullName('A'.repeat(100))).toBe('');
    expect(validateEmail('candidate@example.com')).toBe('');
    expect(validateMobile('1234567890')).toBe('');
    DEPARTMENTS.forEach((department) => expect(validateDepartment(department)).toBe(''));
  });

  it('rejects missing, whitespace-only, malformed, and overlong names', () => {
    expect(validateFullName()).toBe('Full Name is required.');
    expect(validateFullName('   ')).toBe('Full Name is required.');
    expect(validateFullName('Ava 3')).toBe('Full Name can contain alphabets and spaces only.');
    expect(validateFullName('<script>')).toBe('Full Name can contain alphabets and spaces only.');
    expect(validateFullName('A'.repeat(101))).toBe('Full Name must be 100 characters or fewer.');
  });

  it('rejects missing, non-string, and malformed emails', () => {
    expect(validateEmail()).toBe('Email Address is required.');
    expect(validateEmail(' ')).toBe('Email Address is required.');
    expect(validateEmail({})).toBe('Email Address is required.');
    expect(validateEmail('candidate@')).toBe('Enter a valid email address.');
    expect(validateEmail('candidate @example.com')).toBe('Enter a valid email address.');
  });

  it('rejects missing, non-numeric, and non-ten-digit mobile numbers', () => {
    expect(validateMobile()).toBe('Mobile Number is required.');
    expect(validateMobile(' ')).toBe('Mobile Number is required.');
    expect(validateMobile(1234567890)).toBe('Mobile Number is required.');
    expect(validateMobile('123456789')).toBe('Mobile Number must contain exactly 10 digits.');
    expect(validateMobile('12345678901')).toBe('Mobile Number must contain exactly 10 digits.');
    expect(validateMobile('12345-6789')).toBe('Mobile Number must contain exactly 10 digits.');
  });

  it('rejects an omitted or unlisted department', () => {
    expect(validateDepartment()).toBe('Department of Interest is required.');
    expect(validateDepartment('')).toBe('Department of Interest is required.');
    expect(validateDepartment('Product')).toBe('Select a valid department.');
  });

  it('reports every invalid field and identifies invalid collections', () => {
    const errors = validateSubmission({
      fullName: 'Ava 3',
      email: 'not-an-email',
      mobile: '123',
      department: 'Product',
    });

    expect(errors).toEqual({
      fullName: 'Full Name can contain alphabets and spaces only.',
      email: 'Enter a valid email address.',
      mobile: 'Mobile Number must contain exactly 10 digits.',
      department: 'Select a valid department.',
    });
    expect(hasValidationErrors(errors)).toBe(true);
    expect(
      hasValidationErrors(
        validateSubmission({
          fullName: 'Ava Smith',
          email: 'ava@example.com',
          mobile: '1234567890',
          department: 'Design',
        }),
      ),
    ).toBe(false);
  });
});
