/** Browser-local persistence helpers for HireHub candidate submissions. */

/** The localStorage key containing the submission array. */
export const SUBMISSIONS_STORAGE_KEY = 'hirehub_submissions';

/**
 * Read submissions from browser storage and recover from corrupted data.
 *
 * @returns {Array<object>} The stored submission records, or an empty array.
 */
export function getSubmissions() {
  const stored = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);

  if (stored === null) {
    return [];
  }

  try {
    const submissions = JSON.parse(stored);
    if (!Array.isArray(submissions)) {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }

    return submissions;
  } catch {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
}

/**
 * Persist a submission array to browser storage.
 *
 * @param {Array<object>} data - Submission records to save.
 * @returns {void}
 */
export function saveSubmissions(data) {
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Append a unique-email submission without writing a duplicate record.
 *
 * @param {{ id: string, fullName: string, email: string, mobile: string, department: string, submittedAt: string }} submission - Record to append.
 * @returns {boolean} Whether the record was stored.
 */
export function addSubmission(submission) {
  const submissions = getSubmissions();
  if (isEmailDuplicate(submission.email, submissions)) {
    return false;
  }

  saveSubmissions([...submissions, submission]);
  return true;
}

/**
 * Update one submission by ID while retaining all unspecified fields.
 *
 * @param {string} id - Submission identifier.
 * @param {object} updates - Fields to replace.
 * @returns {boolean} Whether a matching record was updated.
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  if (!submissions.some((submission) => submission.id === id)) {
    return false;
  }

  saveSubmissions(
    submissions.map((submission) => (submission.id === id ? { ...submission, ...updates } : submission)),
  );
  return true;
}

/**
 * Remove one submission by ID.
 *
 * @param {string} id - Submission identifier.
 * @returns {boolean} Whether a matching record was deleted.
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const nextSubmissions = submissions.filter((submission) => submission.id !== id);
  if (nextSubmissions.length === submissions.length) {
    return false;
  }

  saveSubmissions(nextSubmissions);
  return true;
}

/**
 * Check whether an email is already present, ignoring capitalization and edge whitespace.
 *
 * @param {string} email - Email address to look up.
 * @param {Array<object>} [submissions=getSubmissions()] - Optional records to inspect.
 * @returns {boolean} Whether a matching email exists.
 */
export function isEmailDuplicate(email, submissions = getSubmissions()) {
  if (typeof email !== 'string') {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  return submissions.some(
    (submission) =>
      typeof submission.email === 'string' && submission.email.trim().toLowerCase() === normalizedEmail,
  );
}
