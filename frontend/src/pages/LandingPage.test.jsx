import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import Header from '../components/Header';
import LandingPage from './LandingPage';

/** Renders a component within a router at the requested initial route. */
function renderWithRouter(ui, initialEntries = ['/']) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe('LandingPage', () => {
  it('renders the exact employer discovery content and all four feature cards', () => {
    renderWithRouter(<LandingPage />);

    expect(screen.getByRole('heading', { name: 'Build Your Future With Us' })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Join a team that values innovation, collaboration, and growth. We're looking for talented people like you.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Why Join Us?' })).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
    expect(screen.getByText('Career Growth')).toBeInTheDocument();
    expect(screen.getByText('Great Culture')).toBeInTheDocument();
    expect(screen.getByText('Global Impact')).toBeInTheDocument();
    expect(screen.getByText('Ready to take the next step?')).toBeInTheDocument();
  });

  it('sends both public calls to action to the apply route', () => {
    renderWithRouter(<LandingPage />);

    expect(screen.getByRole('link', { name: 'Express Your Interest' })).toHaveAttribute('href', '/apply');
    expect(screen.getByRole('link', { name: 'Apply Now' })).toHaveAttribute('href', '/apply');
  });

  it('shows login when unauthenticated and clears auth plus returns home on logout', async () => {
    const user = userEvent.setup();
    const unauthenticatedView = renderWithRouter(<Header />, ['/apply']);

    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/admin');
    expect(screen.getByRole('link', { name: 'Apply' })).toHaveAttribute('aria-current', 'page');

    unauthenticatedView.unmount();
    sessionStorage.setItem('hirehub_admin_auth', 'true');
    renderWithRouter(<Header initialAuthenticated />, ['/admin']);

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    expect(sessionStorage.getItem('hirehub_admin_auth')).toBeNull();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the application form route through the persistent application shell', () => {
    renderWithRouter(<App />, ['/apply']);

    expect(screen.getByRole('heading', { name: 'Join Our Team' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Application' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
