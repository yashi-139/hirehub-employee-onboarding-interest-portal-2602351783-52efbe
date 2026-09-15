import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DEPARTMENTS, hasValidationErrors, validateSubmission } from '../utils/validators';

/** Render editable submission fields inside an accessible focus-managed dialog. */
function EditModal({ submission, onClose, onSave }) {
  const [values, setValues] = useState({
    fullName: submission.fullName,
    email: submission.email,
    mobile: submission.mobile,
    department: submission.department,
  });
  const [errors, setErrors] = useState({ fullName: '', mobile: '', department: '' });
  const dialogRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    /** Close the dialog from the keyboard and trap tab focus inside it. */
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        'button, input, select, [tabindex]:not([tabindex="-1"])',
      );
      const items = Array.from(focusable).filter((element) => !element.disabled);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus?.();
    };
  }, [onClose]);

  /** Update one editable field and remove its previous validation feedback. */
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  /** Validate editable values before saving the approved fields. */
  function handleSubmit(event) {
    event.preventDefault();
    const allErrors = validateSubmission(values);
    const editableErrors = {
      fullName: allErrors.fullName,
      mobile: allErrors.mobile,
      department: allErrors.department,
    };
    if (hasValidationErrors(editableErrors)) {
      setErrors(editableErrors);
      return;
    }
    onSave({
      fullName: values.fullName.trim(),
      mobile: values.mobile,
      department: values.department,
    });
  }

  /** Close only when the click originates from the overlay itself. */
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="admin-modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-submission-title"
        ref={dialogRef}
        tabIndex="-1"
      >
        <h2 id="edit-submission-title">Edit Submission</h2>
        <form className="admin-edit-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="edit-fullName">Full Name</label>
            <input
              id="edit-fullName"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'edit-fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="edit-fullName-error" className="field-error" role="alert">
                {errors.fullName}
              </p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="edit-email">Email Address</label>
            <input
              id="edit-email"
              name="email"
              type="email"
              value={values.email}
              disabled
              readOnly
            />
          </div>
          <div className="form-field">
            <label htmlFor="edit-mobile">Mobile Number</label>
            <input
              id="edit-mobile"
              name="mobile"
              value={values.mobile}
              onChange={handleChange}
              inputMode="numeric"
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={errors.mobile ? 'edit-mobile-error' : undefined}
            />
            {errors.mobile && (
              <p id="edit-mobile-error" className="field-error" role="alert">
                {errors.mobile}
              </p>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="edit-department">Department of Interest</label>
            <select
              id="edit-department"
              name="department"
              value={values.department}
              onChange={handleChange}
              aria-invalid={Boolean(errors.department)}
              aria-describedby={errors.department ? 'edit-department-error' : undefined}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && (
              <p id="edit-department-error" className="field-error" role="alert">
                {errors.department}
              </p>
            )}
          </div>
          <div className="dialog-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="admin-primary-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditModal;