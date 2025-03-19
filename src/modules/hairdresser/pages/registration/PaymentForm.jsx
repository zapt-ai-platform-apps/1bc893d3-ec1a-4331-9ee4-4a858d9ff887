import React, { useState } from 'react';

export default function PaymentForm({ onSubmit }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    
    if (!reference) {
      alert('Please enter a payment reference number.');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({
        method: paymentMethod,
        reference
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-indigo-800">Registration Fee</h3>
        <p className="text-sm text-gray-600">
          A one-time fee of 1,500 FCFA is required to complete your registration.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-800 font-medium">Registration Fee</p>
              <p className="text-sm text-indigo-600">One-time payment</p>
            </div>
            <span className="text-indigo-800 font-bold">1,500 FCFA</span>
          </div>
        </div>
        
        <div>
          <label className="label">Select Payment Method</label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="orange-money"
                type="radio"
                name="payment-method"
                className="h-4 w-4 text-indigo-600 border-gray-300"
                value="orange-money"
                checked={paymentMethod === 'orange-money'}
                onChange={() => setPaymentMethod('orange-money')}
              />
              <label htmlFor="orange-money" className="ml-3 block text-sm text-gray-700">
                Orange Money
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="mtn-money"
                type="radio"
                name="payment-method"
                className="h-4 w-4 text-indigo-600 border-gray-300"
                value="mtn-money"
                checked={paymentMethod === 'mtn-money'}
                onChange={() => setPaymentMethod('mtn-money')}
              />
              <label htmlFor="mtn-money" className="ml-3 block text-sm text-gray-700">
                MTN Money
              </label>
            </div>
          </div>
        </div>
        
        {paymentMethod && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Payment Instructions</h4>
            <ol className="text-sm text-gray-600 space-y-2 pl-5 list-decimal">
              <li>Send 1,500 FCFA to the {paymentMethod === 'orange-money' ? 'Orange Money' : 'MTN Money'} number: <span className="font-medium">+123 456 7890</span></li>
              <li>Use reference code: <span className="font-medium">SALON-REG</span></li>
              <li>After payment, enter the transaction reference number below</li>
            </ol>
          </div>
        )}
        
        <div>
          <label htmlFor="reference" className="label">Transaction Reference Number</label>
          <input
            id="reference"
            type="text"
            className="input"
            placeholder="Enter the reference number from your payment"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps us verify your payment
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading || !paymentMethod || !reference}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Verifying Payment...
            </div>
          ) : 'Complete Registration'}
        </button>
      </div>
    </form>
  );
}