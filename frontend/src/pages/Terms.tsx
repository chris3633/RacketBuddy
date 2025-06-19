import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="mt-12 space-y-8 text-gray-600">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            <p className="mt-4">
              By accessing or using RacketBuddy's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">2. Use of Service</h2>
            <div className="mt-4 space-y-4">
              <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service in any way that violates any applicable laws or regulations</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm others</li>
                <li>Interfere with or disrupt the service</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">3. User Accounts</h2>
            <div className="mt-4 space-y-4">
              <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the security of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">4. Event Participation</h2>
            <p className="mt-4">
              By participating in events listed on RacketBuddy, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Follow the rules and guidelines of each event</li>
              <li>Behave respectfully towards other participants</li>
              <li>Cancel your registration if you cannot attend</li>
              <li>Accept responsibility for your own safety and well-being</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">5. Intellectual Property</h2>
            <p className="mt-4">
              The service and its original content, features, and functionality are owned by RacketBuddy and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">6. Limitation of Liability</h2>
            <p className="mt-4">
              In no event shall RacketBuddy be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">7. Disclaimer</h2>
            <p className="mt-4">
              The service is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be uninterrupted, timely, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">8. Governing Law</h2>
            <p className="mt-4">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">9. Changes to Terms</h2>
            <p className="mt-4">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900">10. Contact Us</h2>
            <p className="mt-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: terms@racketbuddy.com<br />
              Address: [Your Company Address]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms; 