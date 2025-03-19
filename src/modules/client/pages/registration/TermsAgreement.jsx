import React, { useState } from 'react';

export default function TermsAgreement({ onSubmit }) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (!accepted) {
      alert('You must accept the terms and conditions to continue.');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(accepted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-indigo-800">Terms & Conditions</h3>
        
        <div className="bg-gray-50 rounded-md p-4 h-64 overflow-y-auto text-sm text-gray-700 border border-gray-200">
          <h4 className="text-base font-medium mb-2">Salon App Client Agreement</h4>
          
          <p className="mb-2">
            This agreement ("Agreement") is made between you, the Client, and Salon App ("we," "us," or "our").
          </p>
          
          <h5 className="font-medium mt-3">1. Service Description</h5>
          <p className="mb-2">
            Salon App provides a platform connecting Clients with Hairdressers. We do not provide hair services directly but facilitate the connection between Clients and service providers.
          </p>
          
          <h5 className="font-medium mt-3">2. Booking and Cancellation</h5>
          <p className="mb-2">
            When you book an appointment through our platform, you agree to attend the appointment at the scheduled time. Cancellations must be made at least 24 hours in advance of the scheduled appointment. Late cancellations may incur a fee.
          </p>
          
          <h5 className="font-medium mt-3">3. Payment</h5>
          <p className="mb-2">
            Payment for services is made through our platform. We collect the payment on behalf of the Hairdresser and transfer it to them after deducting our service fee. All prices are in FCFA.
          </p>
          
          <h5 className="font-medium mt-3">4. User Conduct</h5>
          <p className="mb-2">
            You agree to use our platform in a lawful manner and treat Hairdressers with respect. We reserve the right to suspend or terminate your account if you violate these terms.
          </p>
          
          <h5 className="font-medium mt-3">5. Privacy</h5>
          <p className="mb-2">
            We collect and process your personal information in accordance with our Privacy Policy. By using our platform, you consent to our collection and use of your data as described in the Privacy Policy.
          </p>
          
          <h5 className="font-medium mt-3">6. Limitation of Liability</h5>
          <p className="mb-2">
            We are not responsible for the quality of services provided by Hairdressers. While we make efforts to verify Hairdressers on our platform, we do not guarantee their services.
          </p>
          
          <h5 className="font-medium mt-3">7. Changes to Terms</h5>
          <p className="mb-2">
            We may update these terms from time to time. Continued use of our platform after such changes constitutes acceptance of the new terms.
          </p>
          
          <h5 className="font-medium mt-3">8. Governing Law</h5>
          <p className="mb-2">
            This Agreement shall be governed by the laws of [Country/Region], without regard to its conflict of law provisions.
          </p>
        </div>
        
        <div className="flex items-start mt-4">
          <input
            id="accept-terms"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            required
          />
          <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
            I have read and agree to the Terms and Conditions
          </label>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className={`btn-primary w-full ${!accepted ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!accepted || loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : 'Accept and Continue'}
        </button>
      </div>
    </form>
  );
}