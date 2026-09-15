import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Innovation',
    icon: '💡',
    description: 'Cutting-edge projects that push boundaries and shape the future of technology.',
  },
  {
    title: 'Career Growth',
    icon: '📈',
    description: 'Clear career paths, mentorship, and continuous learning.',
  },
  {
    title: 'Great Culture',
    icon: '🤝',
    description: 'A diverse inclusive workplace where collaboration and creativity thrive.',
  },
  {
    title: 'Global Impact',
    icon: '🌍',
    description: 'Work reaching millions of users worldwide and making a real difference.',
  },
];

/**
 * Renders one employer-value feature card.
 *
 * @param {{ title: string, icon: string, description: string }} props - Feature content.
 * @returns {JSX.Element} A feature card.
 */
function FeatureCard({ title, icon, description }) {
  return (
    <article className="feature-card">
      <span className="feature-icon" role="img" aria-label={title}>
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

/** Renders the public employer-discovery experience and routes candidates to apply. */
function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-content">
          <h1 id="hero-heading">Build Your Future With Us</h1>
          <p>
            Join a team that values innovation, collaboration, and growth. We&apos;re looking for
            talented people like you.
          </p>
          <Link className="cta-button" to="/apply">
            Express Your Interest
          </Link>
        </div>
      </section>

      <section className="features-section" aria-labelledby="why-join-heading">
        <h2 id="why-join-heading">Why Join Us?</h2>
        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="bottom-cta" aria-labelledby="bottom-cta-heading">
        <h2 id="bottom-cta-heading">Ready to take the next step?</h2>
        <Link className="cta-button" to="/apply">
          Apply Now
        </Link>
      </section>
    </div>
  );
}

export default LandingPage;
