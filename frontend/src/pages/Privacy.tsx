import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="mt-12 space-y-8 text-gray-600">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
            <p className="mt-4">
              RacketBuddy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            <div className="mt-4 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">2.1 Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Location data</li>
                <li>Tennis skill level and preferences</li>
                <li>Event participation history</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            <div className="mt-4 space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your event registrations</li>
                <li>Send you notifications about events</li>
                <li>Improve our services</li>
                <li>Communicate with you about updates and changes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Information Sharing</h2>
            <p className="mt-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Other users (only the information necessary for event participation)</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
            <p className="mt-4">
              Under applicable US laws, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Data Security</h2>
            <p className="mt-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">7. Cookies and Tracking</h2>
            <p className="mt-4">
              We use cookies and similar tracking technologies to improve your experience on our website. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">8. Children's Privacy</h2>
            <p className="mt-4">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">9. Changes to This Policy</h2>
            <p className="mt-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">10. Contact Us</h2>
            <p className="mt-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@racketbuddy.com<br />
              Address: [Your Company Address]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 