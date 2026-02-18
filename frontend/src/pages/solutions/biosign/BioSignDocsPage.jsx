import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Code, Terminal, Book, ArrowRight, Copy, Check,
  ChevronRight, ExternalLink
} from 'lucide-react';
import BioSignNavbar from './BioSignNavbar';

const BioSignDocsPage = () => {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExamples = {
    javascript: `import BioSignSDK from '@biosign/sdk';

// Initialize SDK
const biosign = new BioSignSDK({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Register device using WebAuthn
async function registerDevice() {
  const credential = await navigator.credentials.create({
    publicKey: await biosign.getRegistrationOptions()
  });

  const result = await biosign.registerDevice({
    credential,
    deviceName: 'My Browser',
    deviceType: 'web'
  });

  console.log('Device registered:', result.deviceId);
}

// Create signed transaction
async function createTransaction(amount, recipient) {
  // Transaction payload for signing
  const payload = {
    amount,
    recipientId: recipient.id,
    recipientName: recipient.name,
    timestamp: Date.now()
  };

  // Sign with device private key (triggers biometric)
  const signature = await biosign.signTransaction(payload);

  // Submit to server
  const result = await biosign.submitTransaction({
    ...payload,
    signature
  });

  // Handle risk-based response
  if (result.verification_required === 'biometric') {
    await biosign.requestBiometricConfirmation(result.transactionId);
  }

  return result;
}`,
    python: `from biosign import BioSignSDK

# Initialize SDK
biosign = BioSignSDK(
    api_key='your-api-key',
    environment='production'
)

# Verify a transaction signature
def verify_transaction(transaction_id, signature):
    result = biosign.transactions.verify(
        transaction_id=transaction_id,
        signature=signature
    )
    
    if result.valid:
        print(f"Transaction {transaction_id} verified")
        return True
    else:
        print(f"Invalid signature: {result.error}")
        return False

# Analyze transaction risk
def analyze_risk(user_id, amount, recipient_id):
    risk = biosign.risk.analyze(
        user_id=user_id,
        amount=amount,
        recipient_id=recipient_id,
        geolocation={'lat': 40.71, 'lng': -74.00}
    )
    
    print(f"Risk level: {risk.level}")
    print(f"Risk score: {risk.score}")
    return risk`,
    curl: `# Register a new device
curl -X POST https://api.biosign.dev/api/devices/register \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user-123",
    "device_name": "Chrome on MacBook",
    "device_type": "web",
    "public_key": "base64-encoded-key",
    "device_fingerprint": {
      "browser": "Chrome",
      "platform": "MacOS"
    }
  }'

# Create a transaction
curl -X POST https://api.biosign.dev/api/transactions/create \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user-123",
    "device_id": "device-uuid",
    "amount": 1500.00,
    "currency": "USD",
    "recipient_id": "ACC-123456",
    "signature": "cryptographic-signature"
  }'

# Analyze risk
curl -X POST https://api.biosign.dev/api/risk/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user-123",
    "amount": 5000.00,
    "recipient_id": "NEW-RECIPIENT"
  }'`
  };

  const sdkConfig = [
    { name: 'apiKey', type: 'string', required: true, description: 'Your BioSign API key' },
    { name: 'environment', type: 'string', required: true, description: "'sandbox' or 'production'" },
    { name: 'timeout', type: 'number', required: false, description: 'Request timeout in ms (default: 30000)' },
    { name: 'retries', type: 'number', required: false, description: 'Number of retries (default: 3)' },
    { name: 'webhookUrl', type: 'string', required: false, description: 'URL for webhook callbacks' },
    { name: 'logLevel', type: 'string', required: false, description: "'debug', 'info', 'warn', 'error'" },
  ];

  const quickStartSteps = [
    { step: 1, title: 'Get your API key from the dashboard', link: '/solutions/biosign/demo' },
    { step: 2, title: 'Register user devices using WebAuthn/FIDO2', link: null },
    { step: 3, title: 'Sign transactions with device-bound keys', link: null },
    { step: 4, title: 'Handle risk-based verification responses', link: null },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Product Navigation */}
      <BioSignNavbar />
      
      {/* Header */}
      <section className="pt-32 pb-12 border-b border-slate-800">
        <div className="container mx-auto px-6 lg:px-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            API Documentation
          </h1>
          <p className="text-slate-400 text-lg">
            Complete reference for integrating BioSign SDK into your application
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link 
              to="/solutions/biosign/demo"
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-all"
            >
              Quick Start
            </Link>
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Postman Collection
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="sticky top-24 space-y-1">
              <p className="text-slate-400 text-sm font-medium mb-4">ON THIS PAGE</p>
              <a href="#getting-started" className="block py-2 text-cyan-400 border-l-2 border-cyan-400 pl-4">Getting Started</a>
              <a href="#authentication" className="block py-2 text-slate-400 hover:text-white border-l-2 border-transparent pl-4">Authentication</a>
              <a href="#endpoints" className="block py-2 text-slate-400 hover:text-white border-l-2 border-transparent pl-4">API Endpoints</a>
              <a href="#examples" className="block py-2 text-slate-400 hover:text-white border-l-2 border-transparent pl-4">Code Examples</a>
              <a href="#config" className="block py-2 text-slate-400 hover:text-white border-l-2 border-transparent pl-4">SDK Configuration</a>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Getting Started */}
            <section id="getting-started">
              <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
              <p className="text-slate-400 mb-6">
                BioSign SDK provides secure transaction authorization without OTP. Follow these steps to integrate:
              </p>

              <div className="space-y-4">
                {quickStartSteps.map((item) => (
                  <div key={item.step} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
                      {item.step}
                    </div>
                    <span className="text-white flex-1">{item.title}</span>
                    {item.link && (
                      <Link to={item.link} className="text-cyan-400 hover:text-cyan-300">
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <Link 
                  to="/solutions/biosign/features"
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Try Device Demo
                </Link>
                <Link 
                  to="/solutions/biosign/features"
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Try Transaction Demo
                </Link>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
              <p className="text-slate-400 mb-6">
                All API requests require authentication using your API key in the Authorization header:
              </p>

              <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                <code className="text-cyan-400">Authorization: Bearer YOUR_API_KEY</code>
              </div>

              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-amber-400 font-medium">Security Note</p>
                <p className="text-slate-400 text-sm mt-1">
                  Never expose your API key in client-side code. Use server-side requests or a secure backend proxy.
                </p>
              </div>
            </section>

            {/* API Endpoints */}
            <section id="endpoints">
              <h2 className="text-2xl font-bold text-white mb-4">API Endpoints</h2>
              
              <div className="space-y-6">
                {/* Device Registration */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono">POST</span>
                    <code className="text-cyan-400">/api/devices/register</code>
                  </div>
                  <div className="p-4">
                    <p className="text-slate-400 mb-4">Register a new device with WebAuthn/FIDO2</p>
                    
                    <div className="flex gap-2 mb-4">
                      <button className="px-3 py-1 bg-cyan-500 text-white rounded text-sm">Request</button>
                      <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm">Response</button>
                    </div>

                    <pre className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto">
                      <code className="text-slate-300">{`{
  "user_id": "user-123",
  "device_name": "Chrome on MacBook",
  "device_type": "web",
  "public_key": "base64-encoded-key",
  "device_fingerprint": {
    "browser": "Chrome",
    "platform": "MacOS"
  }
}`}</code>
                    </pre>
                  </div>
                </div>

                {/* Transaction */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono">POST</span>
                    <code className="text-cyan-400">/api/transactions/create</code>
                  </div>
                  <div className="p-4">
                    <p className="text-slate-400 mb-4">Create and sign a new transaction</p>
                    
                    <pre className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto">
                      <code className="text-slate-300">{`{
  "user_id": "user-123",
  "device_id": "device-uuid",
  "amount": 1500.00,
  "currency": "USD",
  "recipient_id": "ACC-123456",
  "recipient_name": "Jane Doe",
  "signature": "cryptographic-signature",
  "geolocation": { "lat": 40.71, "lng": -74.00 }
}`}</code>
                    </pre>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-3">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono">POST</span>
                    <code className="text-cyan-400">/api/risk/analyze</code>
                  </div>
                  <div className="p-4">
                    <p className="text-slate-400 mb-4">Analyze transaction risk with AI</p>
                    
                    <pre className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto">
                      <code className="text-slate-300">{`{
  "user_id": "user-123",
  "device_id": "device-uuid",
  "amount": 5000.00,
  "recipient_id": "NEW-RECIPIENT",
  "geolocation": { "lat": 40.71, "lng": -74.00 },
  "behavioral_data": {
    "typing_speed_deviation": 0.3,
    "session_duration": 0.8
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples">
              <h2 className="text-2xl font-bold text-white mb-4">Code Examples</h2>
              
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="flex border-b border-slate-700">
                  {['javascript', 'python', 'curl'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <button
                    onClick={() => copyCode(codeExamples[activeTab])}
                    className="absolute top-4 right-4 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                  <pre className="p-6 text-sm overflow-x-auto">
                    <code className="text-slate-300">{codeExamples[activeTab]}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* SDK Configuration */}
            <section id="config">
              <h2 className="text-2xl font-bold text-white mb-4">SDK Configuration</h2>
              
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Parameter</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Required</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-slate-400">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {sdkConfig.map((config, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <code className="text-cyan-400">{config.name}</code>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{config.type}</td>
                        <td className="px-6 py-4">
                          {config.required ? (
                            <span className="text-red-400">required</span>
                          ) : (
                            <span className="text-slate-500">optional</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400">{config.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioSignDocsPage;
