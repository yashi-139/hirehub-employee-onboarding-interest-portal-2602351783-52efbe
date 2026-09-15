/** Pure validation rules for candidate interest submissions. */

/** The only departments candidates may select. */
export const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Sales',
  'Data Science',
];

/**
 * Validate a candidate full name.
 *
 * @param {unknown} fullName - Candidate name to validate.
 * @returns {string} An empty string when valid, otherwise a user-facing error.
 */
export function validateFullName(fullName) {
  if (typeof fullName !== 'string' || fullName.trim() === '') {
    return 'Full Name is required.';
  }

  if (fullName.length > 100) {
    return 'Full Name must be 100 characters or fewer.';
  }

  if (!/^[A-Za-z ]+$/.test(fullName)) {
    return 'Full Name can contain alphabets and spaces only.';
  }

  return '';
}

/**
 * Validate a candidate email address.
 *
 * @param {unknown} email - Email address to validate.
 * @returns {string} An empty string when valid, otherwise a user-facing error.
 */
export function validateEmail(email) {
  if (typeof email !== 'string' || email.trim() === '') {
    return 'Email Address is required.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Enter a valid email address.';
  }

  return '';
}

/**
 * Validate a candidate mobile number.
 *
 * @param {unknown} mobile - Mobile number to validate.
 * @returns {string} An empty string when valid, otherwise a user-facing error.
 */
export function validateMobile(mobile) {
  if (typeof mobile !== 'string' || mobile.trim() === '') {
    return 'Mobile Number is required.';
  }

  if (!/^\d{10}$/.test(mobile)) {
    return 'Mobile Number must contain exactly 10 digits.';
  }

  return '';
}

/**
 * Validate a selected department against the allowed choices.
 *
 * @param {unknown} department - Department value to validate.
 * @returns {string} An empty string when valid, otherwise a user-facing error.
 */
export function validateDepartment(department) {
  if (typeof department !== 'string' || department === '') {
    return 'Department of Interest is required.';
  }

  if (!DEPARTMENTS.includes(department)) {
    return 'Select a valid department.';
  }

  return '';
}

/**
 * Validate all candidate submission fields without mutating them.
 *
 * @param {{ fullName?: unknown, email?: unknown, mobile?: unknown, department?: unknown }} values - Form values.
 * @returns {{ fullName: string, email: string, mobile: string, department: string }} Field errors keyed by input name.
 */
export function validateSubmission(values) {
  return {
    fullName: validateFullName(values?.fullName),
    email: validateEmail(values?.email),
    mobile: validateMobile(values?.mobile),
    department: validateDepartment(values?.department),
  };
}

/**
 * Determine whether a submission error collection has any error text.
 *
 * @param {{ fullName: string, email: string, mobile: string, department: string }} errors - Validation results.
 * @returns {boolean} Whether at least one field is invalid.
 */
export function hasValidationErrors(errors) {
  return Object.values(errors).some(Boolean);
}
