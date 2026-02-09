/**
 * Payment Success Page
 * Handles redirect from Stripe checkout and shows payment status
 */

import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, XCircle, Loader2, ArrowRight, 
  Download, Mail, Clock, AlertTriangle, Package
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const pollCount = useRef(0);
  const maxPolls = 10;
  const pollInterval = 2000;

  useEffect(() => {
    if (!sessionId) {
      setPaymentStatus('error');
      setError('No session ID found. Please try again.');
      return;
    }

    const pollPaymentStatus = async () => {
      try {
        const response = await fetch(`${API}/payments/status/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to check payment status');
        }
        
        const data = await response.json();
        setPaymentDetails(data);
        
        if (data.payment_status === 'paid') {
          setPaymentStatus('success');
          return true; // Stop polling
        } else if (data.status === 'expired') {
          setPaymentStatus('expired');
          return true; // Stop polling
        } else if (pollCount.current >= maxPolls) {
          setPaymentStatus('timeout');
          return true; // Stop polling
        }
        
        return false; // Continue polling
      } catch (err) {
        console.error('Error checking payment status:', err);
        if (pollCount.current >= maxPolls) {
          setPaymentStatus('error');
          setError(err.message);
          return true;
        }
        return false;
      }
    };

    const startPolling = async () => {
      const shouldStop = await pollPaymentStatus();
      if (!shouldStop) {
        pollCount.current += 1;
        setTimeout(startPolling, pollInterval);
      }
    };

    startPolling();
  }, [sessionId]);

  const renderContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#0a1628]/10 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-[#0a1628] animate-spin" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-4">
              Processing Your Payment
            </h1>
            <p className="text-[#64748b] mb-4">
              Please wait while we confirm your payment...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#64748b]">
              <Clock className="w-4 h-4" />
              <span>This usually takes a few seconds</span>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#22c55e]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-4">
              Payment Successful!
            </h1>
            <p className="text-[#64748b] mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your product access has been activated.
            </p>
            
            {paymentDetails && (
              <div className="bg-[#f8fafc] rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#e63946]" />
                  Order Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Product</span>
                    <span className="font-medium text-[#0a1628]">
                      {paymentDetails.metadata?.package_name || 'Software License'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Amount Paid</span>
                    <span className="font-medium text-[#0a1628]">
                      ${(paymentDetails.amount_total / 100).toFixed(2)} {paymentDetails.currency?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748b]">Status</span>
                    <span className="inline-flex items-center gap-1 text-[#22c55e] font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <p className="text-sm text-[#64748b] flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                A confirmation email has been sent to your inbox
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
                  data-testid="browse-solutions-btn"
                >
                  Browse More Solutions
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-[#0a1628] text-[#0a1628] px-6 py-3 font-semibold hover:bg-[#0a1628] hover:text-white transition-all"
                  data-testid="contact-support-btn"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </motion.div>
        );

      case 'expired':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-[#f59e0b]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-4">
              Session Expired
            </h1>
            <p className="text-[#64748b] mb-8 max-w-md mx-auto">
              Your payment session has expired. This can happen if you took too long to complete the payment.
            </p>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
              data-testid="try-again-btn"
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        );

      case 'timeout':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-[#f59e0b]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-4">
              Payment Status Pending
            </h1>
            <p className="text-[#64748b] mb-8 max-w-md mx-auto">
              We're still confirming your payment. Please check your email for confirmation, 
              or contact support if you don't receive it within a few minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
              >
                Contact Support
              </Link>
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 border-2 border-[#0a1628] text-[#0a1628] px-6 py-3 font-semibold hover:bg-[#0a1628] hover:text-white transition-all"
              >
                Back to Solutions
              </Link>
            </div>
          </motion.div>
        );

      case 'error':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#ef4444]/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-[#ef4444]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-4">
              Payment Error
            </h1>
            <p className="text-[#64748b] mb-8 max-w-md mx-auto">
              {error || 'There was an issue processing your payment. Please try again or contact support.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/solutions"
                className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
              >
                Try Again
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-[#0a1628] text-[#0a1628] px-6 py-3 font-semibold hover:bg-[#0a1628] hover:text-white transition-all"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12 py-24">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
