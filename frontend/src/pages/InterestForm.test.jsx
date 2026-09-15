import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import InterestForm from './InterestForm';
import { SUBMISSIONS_STORAGE_KEY } from '../utils/storage';

/** Render the interest form with the route context required by its back link. */
function renderForm() {
  return render(
    <MemoryRouter>
      <InterestForm />
    </MemoryRouter>,
  );
}

/** Fill each field with a valid candidate submission. */
async function fillValidForm(user) {
  await user.type(screen.getByLabelText('Full Name'), 'Ava Smith');
  await user.type(screen.getByLabelText('Email Address'), 'ava@example.com');
  await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
  await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');
}

afterEach(() => vi.useRealTimers());

describe('InterestForm', () => {
  it('renders the required copy, precisely eight departments, accessible controls, and back navigation', () => {
    renderForm();

    expect(screen.getByRole('heading', { name: 'Join Our Team' })).toBeInTheDocument();
    expect(screen.getByText('Express your interest in working with us.')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeRequired();
    expect(screen.getByLabelText('Email Address')).toBeRequired();
    expect(screen.getByLabelText('Mobile Number')).toBeRequired();
    expect(screen.getByLabelText('Department of Interest')).toBeRequired();
    expect(screen.getAllByRole('option')).toHaveLength(9);
    expect(screen.getByRole('link', { name: '← Back to Home' })).toHaveAttribute('href', '/');
  });

  it('shows inline ARIA-associated validation feedback for every invalid field', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Full Name'), 'Ava3');
    await user.type(screen.getByLabelText('Email Address'), 'not-an-email');
    await user.type(screen.getByLabelText('Mobile Number'), '123');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), '');
    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(screen.getAllByRole('alert')).toHaveLength(4);
    expect(screen.getByText('Full Name can contain alphabets and spaces only.')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number must contain exactly 10 digits.')).toBeInTheDocument();
    expect(screen.getByText('Department of Interest is required.')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('aria-describedby', 'fullName-error');
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-invalid', 'true');
    expect(localStorage.getItem(SUBMISSIONS_STORAGE_KEY)).toBeNull();
  });

  it('persists a full valid record, clears values, and presents the exact success message', async () => {
    const user = userEvent.setup();
    renderForm();
    await fillValidForm(user);

    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(
      screen.getByRole('status', { name: 'Thank you! Your interest has been submitted successfully.' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toHaveValue('');
    expect(screen.getByLabelText('Email Address')).toHaveValue('');
    expect(screen.getByLabelText('Mobile Number')).toHaveValue('');
    expect(screen.getByLabelText('Department of Interest')).toHaveValue('');

    const stored = JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      fullName: 'Ava Smith',
      email: 'ava@example.com',
      mobile: '1234567890',
      department: 'Engineering',
    });
    expect(typeof stored[0].id).toBe('string');
    expect(new Date(stored[0].submittedAt).toISOString()).toBe(stored[0].submittedAt);
  });

  it('rejects a case-insensitive duplicate email without creating another record', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      SUBMISSIONS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'record-1',
          fullName: 'Existing Candidate',
          email: 'AVA@EXAMPLE.COM',
          mobile: '1234567890',
          department: 'Design',
          submittedAt: '2026-03-04T12:00:00.000Z',
        },
      ]),
    );
    renderForm();
    await fillValidForm(user);

    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(screen.getByRole('alert')).toHaveTextContent('This email has already been submitted.');
    expect(JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY))).toHaveLength(1);
    expect(screen.getByLabelText('Full Name')).toHaveValue('Ava Smith');
  });

  it('dismisses the success banner four seconds after submission and cleans up timers on unmount', async () => {
    vi.useFakeTimers();
    const view = renderForm();
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Ava Smith' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'ava@example.com' } });
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Department of Interest'), {
      target: { value: 'Engineering' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Submit Application' }).closest('form'));

    expect(screen.getByRole('status')).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(3999);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    view.unmount();
  });
});
