import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/** Resets the DOM and browser storage so each component test has an isolated session. */
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});
