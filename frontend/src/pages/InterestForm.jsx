import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addSubmission, isEmailDuplicate } from '../utils/storage';
import { DEPARTMENTS, hasValidationErrors, validateSubmission } from '../utils/validators';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const INITIAL_ERRORS = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

/**
 * Produce a UUID using the browser crypto API, with a test-environment fallback.
 *
 * @returns {string} A unique identifier for a new submission.
 */
function createSubmissionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `fallback-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Render the candidate interest form and persist valid submissions locally.
 *
 * @returns {JSX.Element} The candidate application form.
 */
function InterestForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  /**
   * Keep form values in sync with a changed native control.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - Changed input event.
   * @returns {void}
   */
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  }

  /**
   * Validate and persist the candidate's application.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submission event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateSubmission(values);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }

    const normalizedEmail = values.email.trim();
    if (isEmailDuplicate(normalizedEmail)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: 'This email has already been submitted.',
      }));
      setSuccessMessage('');
      return;
    }

    const saved = addSubmission({
      id: createSubmissionId(),
      fullName: values.fullName.trim(),
      email: normalizedEmail,
      mobile: values.mobile,
      department: values.department,
      submittedAt: new Date().toISOString(),
    });

    if (!saved) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: 'This email has already been submitted.',
      }));
      setSuccessMessage('');
      return;
    }

    setValues(INITIAL_VALUES);
    setErrors(INITIAL_ERRORS);
    setSuccessMessage('Thank you! Your interest has been submitted successfully.');
  }

  /**
   * Return the ARIA attributes for an input with optional inline feedback.
   *
   * @param {'fullName' | 'email' | 'mobile' | 'department'} field - Input field name.
   * @returns {{ 'aria-invalid': boolean, 'aria-describedby'?: string }} ARIA error attributes.
   */
  function getErrorAttributes(field) {
    return errors[field]
      ? { 'aria-invalid': true, 'aria-describedby': `${field}-error` }
      : { 'aria-invalid': false };
  }

  return (
    <section className="interest-page" aria-labelledby="interest-form-title">
      <div className="interest-card">
        <div className="interest-heading">
          <h1 id="interest-form-title">Join Our Team</h1>
          <p>Express your interest in working with us.</p>
        </div>

        {successMessage && (
          <p className="form-success" role="status" aria-live="polite" aria-label={successMessage}>
            {successMessage}
          </p>
        )}

        <form className="interest-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={handleChange}
              maxLength="100"
              required
              aria-required="true"
              {...getErrorAttributes('fullName')}
            />
            {errors.fullName && (
              <p id="fullName-error" className="field-error" role="alert">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              required
              aria-required="true"
              {...getErrorAttributes('email')}
            />
            {errors.email && (
              <p id="email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              value={values.mobile}
              onChange={handleChange}
              inputMode="numeric"
              required
              aria-required="true"
              {...getErrorAttributes('mobile')}
            />
            {errors.mobile && (
              <p id="mobile-error" className="field-error" role="alert">
                {errors.mobile}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="department">Department of Interest</label>
            <select
              id="department"
              name="department"
              value={values.department}
              onChange={handleChange}
              required
              aria-required="true"
              {...getErrorAttributes('department')}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && (
              <p id="department-error" className="field-error" role="alert">
                {errors.department}
              </p>
            )}
          </div>

          <button className="submit-application" type="submit">
            Submit Application
          </button>
        </form>

        <Link className="back-home-link" to="/">
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}

export default InterestForm;
