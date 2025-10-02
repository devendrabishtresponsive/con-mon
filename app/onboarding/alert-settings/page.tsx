'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AlertSettings() {
  const [email, setEmail] = useState('user@example.com'); // Pre-filled with user's email
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSaveSettings = () => {
    // Simulate saving settings
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000); // Hide confirmation after 5 seconds
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alert Settings</h1>
        <p className="text-gray-600">
          Get notified by email when daily system checks detect issues with your conversions.
        </p>
      </div>

      {/* Confirmation Banner */}
      {showConfirmation && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <p className="text-green-800 font-medium">
              Daily email alerts enabled. You'll be notified at {email}.
            </p>
          </div>
        </div>
      )}

      {/* Email Alerts Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Email Alerts</CardTitle>
          <CardDescription>
            Configure how you receive notifications about conversion monitoring issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Address Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Enable Daily Email Alerts</h3>
              <p className="text-sm text-gray-600">
                Emails are sent once per day after analysis completes.
              </p>
            </div>
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                alertsEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className={`text-sm font-medium ${alertsEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {alertsEnabled ? '🟢 Alerts Enabled' : '⚪ Alerts Disabled'}
            </span>
            <span className="text-sm text-gray-500">
              {alertsEnabled 
                ? 'You will receive daily email notifications' 
                : 'No email notifications will be sent'
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-start">
        <Button 
          onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          Save Alert Settings
        </Button>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">About Daily Alerts</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Alerts are sent once per day after system analysis completes</li>
          <li>• You'll only receive emails when issues are detected</li>
          <li>• Each email includes a summary of detected problems and recommended actions</li>
          <li>• You can disable alerts at any time by toggling the switch above</li>
        </ul>
      </div>
    </div>
  );
}

