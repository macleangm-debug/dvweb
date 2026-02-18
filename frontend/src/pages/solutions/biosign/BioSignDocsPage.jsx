import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Book, Code, Terminal, Copy, CheckCircle, 
  ChevronRight, ExternalLink, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { ScrollArea } from "../../../components/ui/scroll-area";
import BioSignNavbar from "./BioSignNavbar";
import { toast } from "sonner";

const Documentation = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/devices/register",
      description: "Register a new device with WebAuthn/FIDO2",
      request: `{
  "user_id": "user-123",
  "device_name": "Chrome on MacBook",
  "device_type": "web",
  "public_key": "base64-encoded-key",
  "device_fingerprint": {
    "browser": "Chrome",
    "platform": "MacOS"
  }
}`,
      response: `{
  "success": true,
  "device_id": "uuid-device-id",
  "credential_id": "base64-credential-id",
  "message": "Device registered successfully"
}`
    },
    {
      method: "POST",
      path: "/api/transactions/create",
      description: "Create and sign a new transaction",
      request: `{
  "user_id": "user-123",
  "device_id": "device-uuid",
  "amount": 1500.00,
  "currency": "USD",
  "recipient_id": "ACC-123456",
  "recipient_name": "Jane Doe",
  "signature": "cryptographic-signature",
  "geolocation": { "lat": 40.71, "lng": -74.00 }
}`,
      response: `{
  "success": true,
  "transaction_id": "tx-uuid",
  "status": "pending",
  "risk_analysis": {
    "risk_score": 0.25,
    "risk_level": "low",
    "recommended_action": "approve"
  },
  "verification_required": "biometric"
}`
    },
    {
      method: "POST",
      path: "/api/risk/analyze",
      description: "Analyze transaction risk with AI",
      request: `{
  "user_id": "user-123",
  "device_id": "device-uuid",
  "amount": 5000.00,
  "recipient_id": "NEW-RECIPIENT",
  "geolocation": { "lat": 40.71, "lng": -74.00 },
  "behavioral_data": {
    "typing_speed_deviation": 0.3,
    "session_duration": 0.8
  }
}`,
      response: `{
  "risk_score": 0.65,
  "risk_level": "medium",
  "risk_factors": [
    "High transaction amount",
    "New recipient"
  ],
  "recommended_action": "verify",
  "confidence": 0.85
}`
    },
    {
      method: "GET",
      path: "/api/audit/logs",
      description: "Get tamper-proof audit logs",
      request: `Query params: ?user_id=user-123&event_type=transaction_created&limit=100`,
      response: `[
  {
    "id": "log-uuid",
    "event_type": "transaction_created",
    "user_id": "user-123",
    "transaction_id": "tx-uuid",
    "timestamp": "2025-01-15T10:30:00Z",
    "integrity_hash": "sha256-hash"
  }
]`
    }
  ];

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
    python: `import biosign
from biosign import BioSignClient

# Initialize client
client = BioSignClient(
    api_key='your-api-key',
    environment='production'
)

# Register device
def register_device(user_id: str, device_info: dict):
    result = client.devices.register(
        user_id=user_id,
        device_name=device_info['name'],
        device_type=device_info['type'],
        public_key=device_info['public_key'],
        device_fingerprint=device_info.get('fingerprint', {})
    )
    return result

# Create transaction
def create_transaction(user_id: str, device_id: str, amount: float, recipient: dict):
    # Generate signature (in real implementation, this happens on device)
    payload = {
        'amount': amount,
        'recipient_id': recipient['id'],
        'timestamp': int(time.time())
    }
    signature = client.crypto.sign(payload, device_id)
    
    result = client.transactions.create(
        user_id=user_id,
        device_id=device_id,
        amount=amount,
        recipient_id=recipient['id'],
        recipient_name=recipient['name'],
        signature=signature
    )
    
    return result

# Verify transaction
def verify_transaction(transaction_id: str, device_id: str):
    result = client.transactions.verify(
        transaction_id=transaction_id,
        device_id=device_id,
        biometric_confirmation=True
    )
    return result`,
    curl: `# Register Device
curl -X POST https://api.biosign.io/api/devices/register \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "user_id": "user-123",
    "device_name": "Chrome on MacBook",
    "device_type": "web",
    "public_key": "BASE64_PUBLIC_KEY",
    "device_fingerprint": {
      "browser": "Chrome",
      "platform": "MacOS"
    }
  }'

# Create Transaction
curl -X POST https://api.biosign.io/api/transactions/create \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "user_id": "user-123",
    "device_id": "device-uuid",
    "amount": 1500.00,
    "currency": "USD",
    "recipient_id": "ACC-123456",
    "recipient_name": "Jane Doe",
    "signature": "CRYPTOGRAPHIC_SIGNATURE"
  }'

# Analyze Risk
curl -X POST https://api.biosign.io/api/risk/analyze \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "user_id": "user-123",
    "device_id": "device-uuid",
    "amount": 5000.00,
    "recipient_id": "NEW-RECIPIENT"
  }'`
  };

  return (
    <div className="min-h-screen bg-background noise-bg" data-testid="documentation-page">
      <BioSignNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
            <p className="text-muted-foreground mt-1">
              Complete reference for integrating BioSign SDK into your application
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/onboarding">
              <Button className="glow-green">
                <Zap className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
            </Link>
            <Button variant="outline" onClick={() => {
              window.open(`${process.env.REACT_APP_BACKEND_URL}/api/docs/postman-collection`, '_blank');
            }}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Postman Collection
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <a href="#getting-started" className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  Getting Started
                </a>
                <a href="#authentication" className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  Authentication
                </a>
                <a href="#endpoints" className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  API Endpoints
                </a>
                <a href="#code-examples" className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  Code Examples
                </a>
                <a href="#webhooks" className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  Webhooks
                </a>
                <a href="#errors" className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  Error Handling
                </a>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            <section id="getting-started">
              <Card className="bg-card border-border" data-testid="getting-started-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    BioSign SDK provides secure transaction authorization without OTP. 
                    Follow these steps to integrate:
                  </p>
                  <ol className="space-y-3">
                    {[
                      "Get your API key from the dashboard",
                      "Register user devices using WebAuthn/FIDO2",
                      "Sign transactions with device-bound keys",
                      "Handle risk-based verification responses"
                    ].map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="flex gap-3 pt-4">
                    <Link to="/demo/device">
                      <Button variant="outline" data-testid="try-device-demo-link">
                        Try Device Demo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    <Link to="/demo/transaction">
                      <Button variant="outline" data-testid="try-transaction-demo-link">
                        Try Transaction Demo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <Card className="bg-card border-border" data-testid="authentication-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    All API requests require authentication using your API key in the Authorization header:
                  </p>
                  <div className="terminal">
                    <div className="terminal-header">
                      <div className="terminal-dot bg-red-500" />
                      <div className="terminal-dot bg-yellow-500" />
                      <div className="terminal-dot bg-green-500" />
                    </div>
                    <div className="terminal-body">
                      <pre className="text-sm">Authorization: Bearer YOUR_API_KEY</pre>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-sm text-yellow-400">
                      <strong>Security Note:</strong> Never expose your API key in client-side code. 
                      Use server-side requests or a secure backend proxy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* API Endpoints */}
            <section id="endpoints">
              <Card className="bg-card border-border" data-testid="endpoints-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    API Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {endpoints.map((endpoint, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg bg-accent/30 border border-border/50"
                          data-testid={`endpoint-${index}`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`api-method ${endpoint.method.toLowerCase()}`}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono">{endpoint.path}</code>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>
                          
                          <Tabs defaultValue="request" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-muted">
                              <TabsTrigger value="request">Request</TabsTrigger>
                              <TabsTrigger value="response">Response</TabsTrigger>
                            </TabsList>
                            <TabsContent value="request">
                              <div className="relative">
                                <pre className="p-4 rounded-lg bg-black text-sm font-mono overflow-x-auto">
                                  {endpoint.request}
                                </pre>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => copyToClipboard(endpoint.request, `req-${index}`)}
                                >
                                  {copiedCode === `req-${index}` ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="response">
                              <div className="relative">
                                <pre className="p-4 rounded-lg bg-black text-sm font-mono overflow-x-auto">
                                  {endpoint.response}
                                </pre>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => copyToClipboard(endpoint.response, `res-${index}`)}
                                >
                                  {copiedCode === `res-${index}` ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            {/* Code Examples */}
            <section id="code-examples">
              <Card className="bg-card border-border" data-testid="code-examples-section">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Code Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    {Object.entries(codeExamples).map(([lang, code]) => (
                      <TabsContent key={lang} value={lang}>
                        <div className="relative">
                          <ScrollArea className="h-[400px]">
                            <pre className="p-4 rounded-lg bg-black text-sm font-mono">
                              {code}
                            </pre>
                          </ScrollArea>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(code, lang)}
                          >
                            {copiedCode === lang ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* SDK Configuration */}
            <section id="sdk-config">
              <Card className="bg-card border-border" data-testid="sdk-config-section">
                <CardHeader>
                  <CardTitle>SDK Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: "apiKey", type: "string", required: true, desc: "Your BioSign API key" },
                      { key: "environment", type: "string", required: true, desc: "'sandbox' or 'production'" },
                      { key: "timeout", type: "number", required: false, desc: "Request timeout in ms (default: 30000)" },
                      { key: "retries", type: "number", required: false, desc: "Number of retries (default: 3)" },
                      { key: "webhookUrl", type: "string", required: false, desc: "URL for webhook callbacks" },
                      { key: "logLevel", type: "string", required: false, desc: "'debug', 'info', 'warn', 'error'" }
                    ].map((config, index) => (
                      <div key={index} className="p-3 rounded-lg bg-accent/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-primary">{config.key}</code>
                          <Badge variant="outline" className="text-xs">{config.type}</Badge>
                          {config.required && <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">required</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{config.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
