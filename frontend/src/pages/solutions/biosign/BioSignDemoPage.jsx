import React from 'react';
import InquiryForm from '../../../components/common/InquiryForm';
import { Fingerprint, Shield, Zap, CheckCircle2 } from 'lucide-react';

const BioSignDemoPage = () => {
  const benefits = [
    { icon: Shield, text: '99.9% fraud prevention rate' },
    { icon: Zap, text: 'Zero OTP delays - instant auth' },
    { icon: CheckCircle2, text: 'PCI DSS & ISO 27001 compliant' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-6 lg:px-12 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BioSign SDK</h1>
                <p className="text-slate-400">by DataVision International</p>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Request a Demo
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              See how BioSign SDK can eliminate OTP vulnerabilities and secure your financial transactions with 
              device-bound biometric authentication.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-300">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-white font-semibold mb-3">What to expect in the demo:</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Live demonstration of WebAuthn/FIDO2 device registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time transaction signing with biometric confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>AI-powered risk analysis and fraud detection in action</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Integration walkthrough for your specific use case</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Q&A session with our security experts</span>
                </li>
              </ul>
            </div>

            {/* Compliance badges */}
            <div className="mt-8">
              <p className="text-slate-500 text-sm mb-3">Trusted by financial institutions worldwide</p>
              <div className="flex flex-wrap gap-2">
                {['PCI DSS 4.0', 'ISO 27001', 'PSD2 SCA', 'FIDO2', 'SOC 2 Type II'].map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm border border-slate-700">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
            <InquiryForm 
              solution="biosign" 
              solutionName="BioSign SDK"
              darkMode={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioSignDemoPage;
