import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Shield, Fingerprint, Lock, Cpu, Activity, FileCheck, 
  ChevronRight, Code, Smartphone, Globe, Zap, CheckCircle2, Calculator,
  Building2, Wallet, Users, ArrowRight, Phone, CreditCard, Banknote,
  Store, Signal, WifiOff, MapPin, BadgeCheck, TrendingUp, Menu, X
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import './biosign.css';

const BioSignLandingPage = () => {
  const [activeIndustry, setActiveIndustry] = useState("mobile-money");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Device-Bound Security",
      description: "Cryptographic keys bound to secure enclave/TEE. Private keys never leave the device.",
    },
    {
      icon: Fingerprint,
      title: "Biometric Confirmation",
      description: "Local biometric matching - fingerprint or face. No biometric data stored on servers.",
    },
    {
      icon: Cpu,
      title: "AI Risk Analysis",
      description: "Real-time transaction risk scoring using advanced AI. Behavioral pattern detection.",
    },
    {
      icon: Lock,
      title: "Zero OTP Required",
      description: "Eliminate SMS/OTP vulnerabilities. Resistant to SIM swap and phishing attacks.",
    },
    {
      icon: Activity,
      title: "Dynamic Linking",
      description: "Transaction payload includes amount, recipient, timestamp for non-repudiation.",
    },
    {
      icon: FileCheck,
      title: "Compliance Ready",
      description: "PCI DSS, ISO 27001, PSD2 SCA aligned. Full audit trail and forensic readiness.",
    },
  ];

  const industries = {
    "mobile-money": {
      title: "Mobile Money",
      subtitle: "M-Pesa, MTN MoMo, Airtel Money, Wave, Orange Money",
      icon: Wallet,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      description: "Secure mobile money transactions for telcos and fintech across Africa, Asia, and emerging markets.",
      useCases: [
        { icon: Phone, title: "Agent PIN Replacement", desc: "Replace 4-digit PINs with biometrics for 500K+ agents" },
        { icon: Users, title: "P2P Transfers", desc: "Secure person-to-person money transfers without SMS OTP" },
        { icon: Store, title: "Merchant Payments", desc: "Biometric confirmation for till payments and QR codes" },
        { icon: WifiOff, title: "Offline Transactions", desc: "Queue transactions in rural areas, sync when online" },
        { icon: Banknote, title: "Cash-In/Cash-Out", desc: "Secure agent float management and customer withdrawals" },
        { icon: MapPin, title: "Geo-Fenced Operations", desc: "Location-based risk scoring for fraud prevention" },
      ],
      stats: [
        { value: "500K+", label: "Agents Secured" },
        { value: "99.9%", label: "Fraud Prevention" },
        { value: "<3s", label: "Auth Time" },
        { value: "40%", label: "Cost Reduction" },
      ],
      partners: ["M-Pesa", "MTN MoMo", "Airtel Money", "Wave", "Orange Money", "Tigo Pesa"]
    },
    "banking": {
      title: "Traditional Banking",
      subtitle: "Retail Banks, Commercial Banks, Digital Banks",
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      description: "Enterprise-grade transaction authorization for banks complying with PSD2, PCI DSS, and local regulations.",
      useCases: [
        { icon: CreditCard, title: "Card-Not-Present", desc: "3DS2 authentication without SMS OTP delays" },
        { icon: Banknote, title: "Wire Transfers", desc: "Biometric authorization for high-value transfers" },
        { icon: Users, title: "Corporate Banking", desc: "Multi-signatory approvals with device binding" },
        { icon: Phone, title: "Mobile Banking", desc: "Seamless login and transaction signing" },
        { icon: Lock, title: "Account Recovery", desc: "Secure self-service without call centers" },
        { icon: Activity, title: "Real-Time Payments", desc: "Instant payment authorization with risk scoring" },
      ],
      stats: [
        { value: "€50B+", label: "Transactions Secured" },
        { value: "85%", label: "False Positive Reduction" },
        { value: "PSD2", label: "SCA Compliant" },
        { value: "60%", label: "Support Cost Savings" },
      ],
      partners: ["Tier 1 Banks", "Digital Banks", "Payment Processors", "Card Networks"]
    }
  };

  const platforms = [
    { icon: Smartphone, label: "Android" },
    { icon: Smartphone, label: "iOS" },
    { icon: Globe, label: "WebAuthn" },
  ];

  const complianceBadges = ["PCI DSS", "ISO 27001", "PSD2 SCA"];

  return (
    <div className="min-h-screen biosign-theme biosign-noise-bg" data-testid="biosign-landing-page">
      {/* Hero Section */}
      <section className="biosign-hero-gradient relative overflow-hidden" data-testid="hero-section">
        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00FF94]/10 border border-[#00FF94]/30 flex items-center justify-center biosign-shield-animate">
                <Shield className="w-6 h-6 text-[#00FF94]" />
              </div>
              <span className="text-xl font-bold tracking-tight">BioSign SDK</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/solutions/biosign/features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/solutions/biosign/docs" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link to="/solutions/biosign/demo" className="text-gray-400 hover:text-white transition-colors">
                Request Demo
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/solutions/biosign/demo" className="hidden sm:block">
                <Button className="biosign-glow-green bg-[#00FF94] text-black hover:bg-[#00E085]" data-testid="hero-cta-btn">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <Link to="/solutions/biosign/features" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Features</Link>
                <Link to="/solutions/biosign/docs" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">Documentation</Link>
                <Link to="/solutions/biosign/demo" className="px-4 py-2 text-[#00FF94] hover:bg-white/5 rounded-lg">Request Demo</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="biosign-animate-fade-in-up">
              <div className="flex items-center gap-2 mb-6">
                {complianceBadges.map((badge) => (
                  <span key={badge} className="biosign-compliance-badge">
                    <CheckCircle2 className="w-3 h-3" />
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Secure Transactions
                <br />
                <span className="text-[#00FF94]">Without OTP</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                Device-bound cryptographic signing with biometric confirmation. 
                Replace SMS/OTP with bank-grade security that's resistant to 
                phishing, SIM swap, and man-in-the-middle attacks.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/solutions/biosign/demo">
                  <Button size="lg" className="biosign-glow-green bg-[#00FF94] text-black hover:bg-[#00E085]" data-testid="get-started-btn">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
                <Link to="/solutions/biosign/docs">
                  <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800" data-testid="view-docs-btn">
                    <Code className="w-5 h-5 mr-2" />
                    View Documentation
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <span className="text-sm text-gray-500">Supported Platforms:</span>
                <div className="flex items-center gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.label} className="flex items-center gap-2 text-sm text-gray-400">
                      <platform.icon className="w-4 h-4" />
                      <span>{platform.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative biosign-animate-fade-in-up biosign-delay-200">
              <div className="relative rounded-2xl overflow-hidden border border-gray-800">
                <img 
                  src="https://images.unsplash.com/photo-1582362710551-6ac08f214e12?w=800&auto=format&fit=crop" 
                  alt="Digital Security Shield"
                  className="w-full h-auto opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              </div>
              {/* Floating stats cards */}
              <div className="absolute -bottom-4 -left-4 biosign-glass rounded-lg p-4 biosign-animate-fade-in-up biosign-delay-300">
                <div className="text-2xl font-bold text-[#00FF94]">99.9%</div>
                <div className="text-xs text-gray-400">Fraud Prevention</div>
              </div>
              <div className="absolute -top-4 -right-4 biosign-glass rounded-lg p-4 biosign-animate-fade-in-up biosign-delay-400">
                <div className="text-2xl font-bold text-[#3B82F6]">0ms</div>
                <div className="text-xs text-gray-400">OTP Delay</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A complete SDK for implementing secure transaction authorization 
              without relying on vulnerable SMS/OTP mechanisms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="biosign-card bg-[#121212] border-gray-800 hover:border-[#00FF94]/50 transition-all duration-200"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="biosign-feature-icon mb-4">
                    <feature.icon className="w-6 h-6 text-[#00FF94]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Use Cases Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#121212]/30" data-testid="industry-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-[#00FF94]/30 text-[#00FF94]">
              Industry Solutions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Built for Financial Services
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Whether you're a mobile money operator or a traditional bank, BioSign SDK 
              adapts to your specific security and compliance requirements.
            </p>
          </div>

          {/* Industry Tabs */}
          <Tabs value={activeIndustry} onValueChange={setActiveIndustry} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-[#0A0A0A]/50">
              <TabsTrigger 
                value="mobile-money" 
                className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
                data-testid="tab-mobile-money"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Mobile Money
              </TabsTrigger>
              <TabsTrigger 
                value="banking" 
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                data-testid="tab-banking"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Banking
              </TabsTrigger>
            </TabsList>

            {Object.entries(industries).map(([key, industry]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Left: Industry Overview */}
                  <div className={`p-8 rounded-2xl border ${industry.borderColor} ${industry.bgColor}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl ${industry.bgColor}`}>
                        <industry.icon className={`w-8 h-8 ${industry.color}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{industry.title}</h3>
                        <p className="text-sm text-gray-400">{industry.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {industry.description}
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {industry.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-4 rounded-lg bg-[#0A0A0A]/50">
                          <div className={`text-2xl font-bold ${industry.color}`}>{stat.value}</div>
                          <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Partners */}
                    <div className="flex flex-wrap gap-2">
                      {industry.partners.map((partner, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-800">
                          {partner}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Right: Use Cases */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BadgeCheck className={`w-5 h-5 ${industry.color}`} />
                      Key Use Cases
                    </h4>
                    <div className="grid gap-4">
                      {industry.useCases.map((useCase, idx) => (
                        <Card 
                          key={idx} 
                          className="bg-[#121212]/50 border-gray-800/50 hover:border-[#00FF94]/30 transition-all"
                          data-testid={`${key}-usecase-${idx}`}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${industry.bgColor} shrink-0`}>
                              <useCase.icon className={`w-5 h-5 ${industry.color}`} />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">{useCase.title}</h5>
                              <p className="text-xs text-gray-400 mt-1">{useCase.desc}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Link to="/solutions/biosign/features">
                        <Button className={key === "mobile-money" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          See {industry.title} Demo
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Simple integration, powerful security. Replace OTP in three steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Device Registration",
                description: "User enrolls their device using WebAuthn/FIDO2. Cryptographic keys generated in secure enclave.",
              },
              {
                step: "02",
                title: "Transaction Signing",
                description: "Each transaction is digitally signed on the user's device with private key. Bank verifies signature.",
              },
              {
                step: "03",
                title: "Biometric Confirm",
                description: "User confirms with biometric (fingerprint/face). Verification happens locally on device.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative" data-testid={`step-${index + 1}`}>
                <div className="text-6xl font-bold text-[#00FF94]/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8" data-testid="code-preview-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                Simple Integration
              </h2>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                Integrate BioSign SDK into your existing banking app with just a few lines of code. 
                Full REST API support with SDK libraries for JavaScript, Python, and mobile platforms.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/solutions/biosign/docs">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800" data-testid="view-api-docs-btn">
                    View API Documentation
                  </Button>
                </Link>
                <Link to="/solutions/biosign/features">
                  <Button variant="ghost" className="hover:bg-gray-800" data-testid="try-device-demo-btn">
                    Try Device Demo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="biosign-terminal" data-testid="code-terminal">
              <div className="biosign-terminal-header">
                <div className="biosign-terminal-dot bg-red-500" />
                <div className="biosign-terminal-dot bg-yellow-500" />
                <div className="biosign-terminal-dot bg-green-500" />
                <span className="text-xs text-gray-400 ml-3">transaction.js</span>
              </div>
              <div className="biosign-terminal-body">
                <pre className="text-sm">
{`// Create signed transaction
const transaction = await biosign.createTransaction({
  amount: 1500.00,
  recipient: "ACC-123456",
  currency: "USD"
});

// Risk analysis
const risk = await biosign.analyzeRisk(transaction);

if (risk.level === "low") {
  // Auto-approve low risk
  await biosign.approve(transaction);
} else {
  // Request biometric confirmation
  await biosign.requestBiometric(transaction);
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 biosign-hero-gradient" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to Eliminate OTP?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join leading banks and fintechs using BioSign SDK for secure, 
            user-friendly transaction authorization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/solutions/biosign/demo">
              <Button size="lg" className="biosign-glow-green bg-[#00FF94] text-black hover:bg-[#00E085]" data-testid="start-free-trial-btn">
                Request Demo
              </Button>
            </Link>
            <Link to="/solutions/biosign/docs">
              <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800" data-testid="read-docs-btn">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#00FF94]" />
              <span className="font-semibold">BioSign SDK</span>
              <span className="text-gray-500 text-sm">by DataVision International</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/solutions/biosign/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link to="/solutions/biosign/features" className="hover:text-white transition-colors">Features</Link>
              <Link to="/solutions/biosign/demo" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 BioSign SDK. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BioSignLandingPage;
