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
          <h4 className="text-base font-medium mb-2">Salon App Hairdresser Agreement</h4>
          
          <p className="mb-2">
            This agreement ("Agreement") is made between you, the Hairdresser, and Salon App ("we," "us," or "our").
          </p>
          
          <h5 className="font-medium mt-3">1. Service Description</h5>
          <p className="mb-2">
            Salon App provides a platform connecting Hairdressers with Clients. We do not employ Hairdressers but provide a marketplace where Hairdressers can offer their services to Clients.
          </p>
          
          <h5 className="font-medium mt-3">2. Registration Fee</h5>
          <p className="mb-2">
            A one-time registration fee of 1,500 FCFA is required to activate your Hairdresser account. This fee helps us maintain quality service and verify legitimate service providers.
          </p>
          
          <h5 className="font-medium mt-3">3. Commission Structure</h5>
          <p className="mb-2">
            For each service booked through our platform, Salon App will retain 40% of the labor cost as our service fee. The remaining 60% will be paid to you, the Hairdresser. Payments will be processed through our platform.
          </p>
          
          <h5 className="font-medium mt-3">4. Appointments</h5>
          <p className="mb-2">
            You agree to honor all appointments booked through our platform. Cancellations should be made at least 24 hours in advance. Repeated cancellations or no-shows may result in suspension or termination of your account.
          </p>
          
          <h5 className="font-medium mt-3">5. Quality of Service</h5>
          <p className="mb-2">
            You agree to provide professional and high-quality services to all Clients. Poor service, as evidenced by consistent negative reviews, may lead to account suspension.
          </p>
          
          <h5 className="font-medium mt-3">6. Verification Process</h5>
          <p className="mb-2">
            After registration, your profile will be reviewed by our team. We may request additional information or verification before approving your account.
          </p>
          
          <h5 className="font-medium mt-3">7. Profile Information</h5>
          <p className="mb-2">
            You are responsible for maintaining accurate information on your profile, including services offered, prices, and availability. Misrepresentation may lead to account suspension.
          </p>
          
          <h5 className="font-medium mt-3">8. Platform Rules</h5>
          <p className="mb-2">
            You agree to follow all platform rules and guidelines, which may be updated from time to time. Continued use of our platform constitutes acceptance of any updated terms.
          </p>
          
          <h5 className="font-medium mt-3">9. Termination</h5>
          <p className="mb-2">
            Either party may terminate this Agreement at any time. Upon termination, any outstanding payments will be settled according to our payment schedule.
          </p>
          
          <h5 className="font-medium mt-3">10. Governing Law</h5>
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