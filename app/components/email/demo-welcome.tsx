import React from 'react';

interface DemoWelcomeEmailProps {
  fullName: string;
  workEmail: string;
  tempPassword: string;
  loginUrl: string;
}

export const DemoWelcomeEmail: React.FC<DemoWelcomeEmailProps> = ({
  fullName,
  workEmail,
  tempPassword,
  loginUrl,
}) => {
  return (
    <div className="font-sans max-w-[600px] mx-auto">
      <h1 className="text-[#2563eb] mb-6">Welcome to Lattis!</h1>
      
      <p className="text-[#374151] text-base leading-relaxed">
        Hi {fullName},
      </p>
      
      <p className="text-[#374151] text-base leading-relaxed">
        Your demo account has been successfully created. Here are your login credentials:
      </p>
      
      <div className="bg-[#f3f4f6] p-4 rounded-lg my-6">
        <p className="m-0 text-[#374151]">
          <strong>Email:</strong> {workEmail}<br />
          <strong>Temporary Password:</strong> {tempPassword}
        </p>
      </div>
      
      <p className="text-[#374151] text-base leading-relaxed">
        For security reasons, please change your password after your first login.
      </p>
      
      <div className="my-8">
        <a
          href={loginUrl}
          className="bg-[#2563eb] text-white px-6 py-3 rounded-lg no-underline inline-block"
        >
          Access Your Demo
        </a>
      </div>
      
      <div className="bg-[#dbeafe] p-4 rounded-lg my-6">
        <h3 className="text-[#1e40af] m-0 mb-2">What's included in your demo:</h3>
        <ul className="text-[#1e40af] m-0 pl-5">
          <li>Full access to all platform features</li>
          <li>Pre-configured sample data</li>
          <li>Interactive dashboards</li>
          <li>API documentation</li>
        </ul>
      </div>
      
      <p className="text-[#374151] text-base leading-relaxed">
        Need help? Our support team is ready to assist you at{' '}
        <a href="mailto:support@lattis.com" className="text-[#2563eb]">
          support@lattis.com
        </a>
      </p>
      
      <hr className="border-0 border-t border-[#e5e7eb] my-8" />
      
      <p className="text-[#6b7280] text-sm">
        This is an automated message from Lattis. Please do not reply to this email.
      </p>
    </div>
  );
}; 