import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Shield, Fingerprint, Lock, Cpu, Activity, FileCheck, 
  ChevronRight, Code, Smartphone, Globe, Zap, CheckCircle2, Calculator,
  Building2, Wallet, Users, ArrowRight, Phone, CreditCard, Banknote,
  Store, Signal, WifiOff, MapPin, BadgeCheck, TrendingUp
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import "./biosign.css";

const BioSignLandingPage = () => {
  const [activeIndustry, setActiveIndustry] = useState("mobile-money");

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
    <div className="min-h-screen bg-background noise-bg" data-testid="landing-page">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden" data-testid="hero-section">
        {/* Navigation - DataVision Logo only (no back arrow) */}
        <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" data-testid="datavision-link">
              <div className="bg-white rounded px-2 py-1">
                <img 
                  src="/datavision-logo-cropped.png" 
                  alt="DataVision" 
                  className="h-6 w-auto"
                />
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/solutions/biosign/features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/solutions/biosign/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link to="/solutions/biosign/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Request Demo
              </Link>
            </div>
            <Link to="/solutions/biosign/demo">
              <Button className="glow-green" data-testid="hero-cta-btn">
                Try Demo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              {/* BioSign Logo/Branding in Hero with Glow Animation */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center biosign-logo-glow">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-primary">BioSign SDK</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                {complianceBadges.map((badge) => (
                  <span key={badge} className="compliance-badge text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Secure Transactions
                <br />
                <span className="text-primary">Without OTP</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Device-bound cryptographic signing with biometric confirmation. 
                Replace SMS/OTP with bank-grade security that's resistant to 
                phishing, SIM swap, and man-in-the-middle attacks.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/solutions/biosign/features">
                  <Button size="lg" className="glow-green" data-testid="get-started-btn">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
                <Link to="/solutions/biosign/docs">
                  <Button size="lg" variant="outline" data-testid="view-docs-btn">
                    <Code className="w-5 h-5 mr-2" />
                    View Documentation
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <span className="text-sm text-muted-foreground">Supported Platforms:</span>
                <div className="flex items-center gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.label} className="flex items-center gap-2 text-sm">
                      <platform.icon className="w-4 h-4 text-muted-foreground" />
                      <span>{platform.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-up delay-200">
              <div className="relative rounded-2xl overflow-hidden border border-border/50 max-h-[320px]">
                <img 
                  src="https://images.unsplash.com/photo-1582362710551-6ac08f214e12?w=800&auto=format&fit=crop" 
                  alt="Digital Security Shield"
                  className="w-full h-auto max-h-[320px] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              {/* Floating stats cards */}
              <div className="absolute -bottom-4 -left-4 glass rounded-lg p-4 animate-fade-in-up delay-300">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-xs text-muted-foreground">Fraud Prevention</div>
              </div>
              <div className="absolute -top-4 -right-4 glass rounded-lg p-4 animate-fade-in-up delay-400">
                <div className="text-2xl font-bold text-secondary">0ms</div>
                <div className="text-xs text-muted-foreground">OTP Delay</div>
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete SDK for implementing secure transaction authorization 
              without relying on vulnerable SMS/OTP mechanisms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="bg-card border-border hover:border-primary/50 transition-all duration-200"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="feature-icon mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Use Cases Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/30" data-testid="industry-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Industry Solutions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Built for Financial Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a mobile money operator or a traditional bank, BioSign SDK 
              adapts to your specific security and compliance requirements.
            </p>
          </div>

          {/* Industry Tabs */}
          <Tabs value={activeIndustry} onValueChange={setActiveIndustry} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-background/50">
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
                        <p className="text-sm text-muted-foreground">{industry.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {industry.description}
                    </p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {industry.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-4 rounded-lg bg-background/50">
                          <div className={`text-2xl font-bold ${industry.color}`}>{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Partners */}
                    <div className="flex flex-wrap gap-2">
                      {industry.partners.map((partner, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
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
                          className="bg-card/50 border-border/50 hover:border-primary/30 transition-all"
                          data-testid={`${key}-usecase-${idx}`}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${industry.bgColor} shrink-0`}>
                              <useCase.icon className={`w-5 h-5 ${industry.color}`} />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sm">{useCase.title}</h5>
                              <p className="text-xs text-muted-foreground mt-1">{useCase.desc}</p>
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <div className="text-6xl font-bold text-primary/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
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
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Integrate BioSign SDK into your existing banking app with just a few lines of code. 
                Full REST API support with SDK libraries for JavaScript, Python, and mobile platforms.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/solutions/biosign/docs">
                  <Button variant="outline" data-testid="view-api-docs-btn">
                    View API Documentation
                  </Button>
                </Link>
                <Link to="/demo/device">
                  <Button variant="ghost" data-testid="try-device-demo-btn">
                    Try Device Demo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="terminal" data-testid="code-terminal">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="text-xs text-muted-foreground ml-3">transaction.js</span>
              </div>
              <div className="terminal-body">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 hero-gradient" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready to Eliminate OTP?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading banks and fintechs using BioSign SDK for secure, 
            user-friendly transaction authorization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/solutions/biosign/features">
              <Button size="lg" className="glow-green" data-testid="start-free-trial-btn">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/solutions/biosign/docs">
              <Button size="lg" variant="outline" data-testid="read-docs-btn">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-semibold">BioSign SDK</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/solutions/biosign/docs" className="hover:text-foreground transition-colors">Documentation</Link>
              <Link to="/compliance" className="hover:text-foreground transition-colors">Compliance</Link>
              <Link to="/audit" className="hover:text-foreground transition-colors">Audit</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 BioSign SDK. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BioSignLandingPage;
