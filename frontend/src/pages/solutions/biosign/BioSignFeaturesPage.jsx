import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BioSignNavbar from "./BioSignNavbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Progress } from "../../../components/ui/progress";
import { Slider } from "../../../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { toast } from "sonner";
import {
  Fingerprint, Smartphone, Shield, Brain, FileText, WifiOff, AlertTriangle, Activity,
  CheckCircle2, CheckCircle, ArrowRight, Lock, Eye, Zap, Globe, Key, RefreshCw,
  Monitor, Send, DollarSign, User, Clock, Gauge, TrendingUp, Search, Filter,
  Bell, Keyboard, MousePointer, ChevronDown, ChevronRight, Copy, Code, Terminal,
  Wifi, Upload, History, XCircle, Settings, Sparkles, Calendar, Building2, Mail,
  X, Gift, Phone, MessageSquare,
} from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

// Demo Session Context
const useDemoSession = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      // Check for existing session in localStorage
      const stored = localStorage.getItem('biosign_demo_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (new Date(parsed.expires_at) > new Date()) {
          setSession(parsed);
          setLoading(false);
          return;
        }
      }
      
      // Create new demo session
      try {
        const response = await axios.post(`${API}/api/demo/session`);
        const sessionData = {
          ...response.data,
          expires_at: new Date(Date.now() + response.data.expires_in * 1000).toISOString()
        };
        localStorage.setItem('biosign_demo_session', JSON.stringify(sessionData));
        setSession(sessionData);
      } catch (error) {
        console.error("Failed to create demo session:", error);
        // Create a fallback local session for demos that don't need backend
        setSession({ access_token: null, user_id: 'local_demo' });
      }
      setLoading(false);
    };
    
    initSession();
  }, []);

  const getAuthHeaders = () => {
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
    return {};
  };

  return { session, loading, getAuthHeaders };
};

// Progress Tracker Hook
const useProgressTracker = () => {
  const [triedFeatures, setTriedFeatures] = useState(() => {
    const stored = localStorage.getItem('biosign_tried_features');
    return stored ? JSON.parse(stored) : [];
  });

  const markFeatureTried = (featureId) => {
    if (!triedFeatures.includes(featureId)) {
      const updated = [...triedFeatures, featureId];
      setTriedFeatures(updated);
      localStorage.setItem('biosign_tried_features', JSON.stringify(updated));
    }
  };

  return { triedFeatures, markFeatureTried, progress: triedFeatures.length };
};

// ============ WEBAUTHN DEMO ============
const WebAuthnDemo = ({ onSuccess, getAuthHeaders }) => {
  const [userId, setUserId] = useState("demo-user");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);

  const registerCredential = async () => {
    setLoading(true);
    setStep(1);
    try {
      await new Promise(r => setTimeout(r, 500));
      setStep(2);
      const response = await axios.post(`${API}/api/webauthn/register/options?user_id=${userId}`);
      setStep(3);
      await new Promise(r => setTimeout(r, 800));
      setStep(4);
      
      const credentialId = btoa(Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => String.fromCharCode(b)).join(''));
      await axios.post(`${API}/api/webauthn/register/verify`, null, {
        params: {
          challenge_id: response.data.challenge_id,
          credential_id: credentialId,
          client_data_json: btoa(JSON.stringify({ type: "webauthn.create", challenge: response.data.options.challenge })),
          attestation_object: btoa("simulated"),
          device_name: "Demo Browser"
        }
      });
      setStep(5);
      setResult({ success: true, message: "Credential registered successfully!" });
      toast.success("WebAuthn registration complete!");
      onSuccess?.();
    } catch (error) {
      setResult({ success: false, message: error.response?.data?.detail || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Request Options", "Generate Keys", "Biometric Verify", "Server Verify", "Complete"];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-primary" />
            Register Credential
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">User ID</Label>
            <Input 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              placeholder="demo-user" 
              className="bg-background border-border"
            />
          </div>
          <Button onClick={registerCredential} disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-black font-medium">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
            {loading ? "Registering..." : "Register with Biometrics"}
          </Button>
          {result && (
            <div className={`p-3 rounded-lg ${result.success ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
              {result.success ? <CheckCircle className="w-4 h-4 inline mr-2" /> : <AlertTriangle className="w-4 h-4 inline mr-2" />}
              {result.message}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Registration Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${step > i ? 'bg-green-500/10 border border-green-500/20' : step === i + 1 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20 border border-border/30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step > i ? 'bg-green-500 text-black' : step === i + 1 ? 'bg-primary text-black' : 'bg-muted text-muted-foreground'}`}>
                {step > i ? <CheckCircle className="w-3 h-3" /> : i + 1}
              </div>
              <span className={step > i ? 'text-green-400' : step === i + 1 ? 'text-primary' : 'text-muted-foreground'}>{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// ============ DEVICE DEMO ============
const DeviceDemo = ({ onSuccess, getAuthHeaders }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const userId = "demo-user-001";

  const fetchDevices = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/devices/${userId}`, { headers: getAuthHeaders() });
      setDevices(response.data);
    } catch (e) { console.log("No devices yet"); }
  }, [getAuthHeaders]);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const registerDevice = async () => {
    if (!deviceName) { toast.error("Enter device name"); return; }
    setLoading(true);
    try {
      const publicKey = btoa(Array.from(crypto.getRandomValues(new Uint8Array(64))).map(b => String.fromCharCode(b)).join(''));
      await axios.post(`${API}/api/devices/register`, {
        user_id: userId, device_name: deviceName, device_type: "web", public_key: publicKey,
        device_fingerprint: { browser: "Chrome", platform: navigator.platform }
      }, { headers: getAuthHeaders() });
      toast.success("Device registered!");
      setDeviceName("");
      fetchDevices();
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to register device");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Register Device
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Device Name</Label>
            <Input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="e.g., My MacBook" />
          </div>
          <Button onClick={registerDevice} disabled={loading} className="w-full">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Smartphone className="w-4 h-4 mr-2" />}
            Register Device
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Registered Devices ({devices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {devices.length > 0 ? devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 mb-2 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-sm">{d.device_name}</p>
                    <p className="text-xs text-muted-foreground">{d.device_type}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-400">Active</Badge>
              </div>
            )) : (
              <p className="text-center text-muted-foreground py-8">No devices registered yet</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ TRANSACTION DEMO ============
const TransactionDemo = ({ onSuccess, getAuthHeaders }) => {
  const [amount, setAmount] = useState("500");
  const [recipient, setRecipient] = useState("ACC-123456");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const createTransaction = async () => {
    setLoading(true);
    try {
      const signature = btoa(JSON.stringify({ amount, recipient, timestamp: Date.now() }));
      const response = await axios.post(`${API}/api/transactions/create`, {
        user_id: "demo-user-001", device_id: "demo-device", amount: parseFloat(amount),
        currency: "USD", recipient_id: recipient, recipient_name: "Jane Smith",
        description: "Demo payment", signature,
        geolocation: { lat: 40.7128, lng: -74.0060, city: "New York", country: "US" }
      }, { headers: getAuthHeaders() });
      setResult(response.data);
      toast.success("Transaction created!");
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create transaction");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-500" />
            Create Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-9" type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
          </div>
          <Button onClick={createTransaction} disabled={loading} className="w-full">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
            Sign & Submit
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Result</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span className="text-muted-foreground">ID</span><span className="font-mono text-xs">{result.transaction_id?.slice(0,12)}...</span></div>
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span className="text-muted-foreground">Status</span><Badge className="bg-green-500/10 text-green-400">{result.status}</Badge></div>
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span className="text-muted-foreground">Risk Score</span><span className={result.risk_analysis?.risk_level === 'low' ? 'text-green-400' : 'text-yellow-400'}>{(result.risk_analysis?.risk_score * 100).toFixed(0)}%</span></div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Submit a transaction to see results</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============ RISK ANALYSIS DEMO ============
const RiskDemo = ({ onSuccess }) => {
  const [amount, setAmount] = useState(500);
  const [newRecipient, setNewRecipient] = useState(false);
  const [unusualLocation, setUnusualLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeRisk = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/risk/analyze`, {
        user_id: "demo-user-001", device_id: "demo-device", amount,
        recipient_id: newRecipient ? "NEW-999" : "KNOWN-123",
        geolocation: unusualLocation ? { lat: -33.86, lng: 151.20, city: "Sydney", country: "AU" } : { lat: 40.71, lng: -74.00, city: "New York", country: "US" },
        behavioral_data: { typing_speed_deviation: 0.2, session_duration: 0.8 }
      });
      setResult(response.data);
      toast.success("Risk analysis complete!");
      onSuccess?.();
    } catch (error) {
      toast.error("Analysis failed");
    } finally { setLoading(false); }
  };

  const getRiskColor = (level) => ({ low: "text-green-400", medium: "text-yellow-400", high: "text-red-400" }[level] || "text-yellow-400");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Risk Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between"><Label>Amount</Label><span className="text-primary font-bold">${amount}</span></div>
            <Slider value={[amount]} onValueChange={([v]) => setAmount(v)} min={10} max={10000} step={100} />
          </div>
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded">
            <span>New Recipient</span>
            <Button size="sm" variant={newRecipient ? "default" : "outline"} onClick={() => setNewRecipient(!newRecipient)}>{newRecipient ? "Yes" : "No"}</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded">
            <span>Unusual Location</span>
            <Button size="sm" variant={unusualLocation ? "default" : "outline"} onClick={() => setUnusualLocation(!unusualLocation)}>{unusualLocation ? "Yes" : "No"}</Button>
          </div>
          <Button onClick={analyzeRisk} disabled={loading} className="w-full">
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Gauge className="w-4 h-4 mr-2" />}
            Analyze Risk
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className={`text-5xl font-bold ${getRiskColor(result.risk_level)}`}>{(result.risk_score * 100).toFixed(0)}%</p>
                <p className={`text-lg uppercase ${getRiskColor(result.risk_level)}`}>{result.risk_level} Risk</p>
              </div>
              <Progress value={result.risk_score * 100} className={`h-2 ${result.risk_level === 'low' ? '[&>div]:bg-green-500' : result.risk_level === 'medium' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
              {result.risk_factors?.length > 0 && (
                <div className="space-y-1">
                  {result.risk_factors.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-yellow-400">
                      <AlertTriangle className="w-3 h-3" />{f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Adjust parameters and analyze</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============ AUDIT LOGS DEMO ============
const AuditDemo = ({ onSuccess }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API}/api/audit/logs?limit=10`);
        setLogs(response.data);
        if (response.data.length > 0) onSuccess?.();
      } catch (e) { console.log("No logs"); }
      setLoading(false);
    };
    fetchLogs();
  }, [onSuccess]);

  const getEventColor = (type) => ({
    device_registration: "text-green-400 bg-green-500/10",
    transaction_created: "text-blue-400 bg-blue-500/10",
    demo_session_created: "text-purple-400 bg-purple-500/10",
  }[type] || "text-muted-foreground bg-muted");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" />
          Audit Log ({logs.length} entries)
          <Badge variant="outline" className="ml-auto text-green-400"><CheckCircle className="w-3 h-3 mr-1" />SHA-256 Protected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin" /></div>
          ) : logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-accent/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getEventColor(log.event_type)}>{log.event_type?.replace(/_/g, ' ')}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span><span className="text-muted-foreground">Hash:</span> <code className="text-primary/70">{log.integrity_hash?.slice(0,16)}...</code></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No audit logs yet. Try the other demos first!</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// ============ OFFLINE TRANSACTIONS DEMO ============
const OfflineDemo = ({ onSuccess }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncedCount, setSyncedCount] = useState(0);

  const queueTransaction = () => {
    setPendingCount(prev => prev + 1);
    toast.success("Transaction queued!");
    onSuccess?.();
  };

  const syncAll = () => {
    setSyncedCount(prev => prev + pendingCount);
    setPendingCount(0);
    toast.success("All transactions synced!");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-cyan-500" />
            Offline Queue Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <Wifi className="w-5 h-5 text-green-400" />
            <span className="font-medium">Online</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Users can sign transactions offline. They sync automatically when connectivity returns.
          </p>
          <Button onClick={queueTransaction} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Queue Offline Transaction
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sync Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{syncedCount}</p>
              <p className="text-xs text-muted-foreground">Synced</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" disabled={pendingCount === 0} onClick={syncAll}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All ({pendingCount})
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ FRAUD ALERTS DEMO ============
const FraudDemo = ({ onSuccess }) => {
  const [alerts, setAlerts] = useState([]);

  const createTestAlert = () => {
    const severities = ["critical", "high", "medium", "low"];
    const types = ["unusual_location", "high_amount", "velocity_exceeded", "new_device"];
    const newAlert = {
      id: Date.now(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      alert_type: types[Math.floor(Math.random() * types.length)],
      risk_score: Math.floor(Math.random() * 50) + 50,
      created_at: new Date().toISOString(),
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 5));
    toast.warning("New fraud alert!");
    onSuccess?.();
  };

  const getSeverityColor = (s) => ({
    critical: "bg-red-500/10 text-red-500 border-red-500/30",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    low: "bg-green-500/10 text-green-500 border-green-500/30"
  }[s] || "bg-muted");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Fraud Alert System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Real-time monitoring detects suspicious patterns and triggers instant alerts.
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {["critical", "high", "medium", "low"].map(s => (
              <div key={s} className={`p-2 rounded ${getSeverityColor(s)}`}>
                <p className="text-lg font-bold">{alerts.filter(a => a.severity === s).length}</p>
                <p className="text-xs capitalize">{s}</p>
              </div>
            ))}
          </div>
          <Button onClick={createTestAlert} variant="outline" className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Simulate Alert
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className="p-3 rounded-lg bg-accent/30 border border-border/50">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(a.severity)}>{a.severity}</Badge>
                      <span className="text-sm">{a.alert_type.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Risk: {a.risk_score}%</span>
                      <span>{new Date(a.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No alerts. Click simulate to test.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ BEHAVIORAL BIOMETRICS DEMO ============
const BehavioralDemo = ({ onSuccess }) => {
  const [collecting, setCollecting] = useState(false);
  const [text, setText] = useState("");
  const [keyCount, setKeyCount] = useState(0);
  const [analysis, setAnalysis] = useState(null);

  const handleKeyDown = () => {
    if (collecting) setKeyCount(prev => prev + 1);
  };

  const startCollection = () => {
    setCollecting(true);
    setText("");
    setKeyCount(0);
    setAnalysis(null);
    toast.info("Start typing to collect behavioral data");
  };

  const analyzePattern = () => {
    setCollecting(false);
    const typingSpeed = text.length / 5;
    const riskScore = Math.random() * 30;
    setAnalysis({
      typing_speed: typingSpeed.toFixed(1),
      key_events: keyCount,
      risk_score: riskScore.toFixed(0),
      recommendation: riskScore < 20 ? "normal" : "review"
    });
    toast.success("Behavioral analysis complete!");
    onSuccess?.();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Behavioral Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center gap-2 p-3 rounded-lg ${collecting ? 'bg-green-500/10' : 'bg-muted/30'}`}>
            <div className={`w-3 h-3 rounded-full ${collecting ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
            <span>{collecting ? "Collecting..." : "Ready"}</span>
          </div>
          <div className="space-y-2">
            <Label>Type something naturally:</Label>
            <textarea 
              className="w-full h-24 p-3 rounded-lg bg-muted border border-border resize-none"
              placeholder={collecting ? "Type here..." : "Click Start to begin"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!collecting}
            />
          </div>
          {!collecting ? (
            <Button onClick={startCollection} className="w-full">
              <Activity className="w-4 h-4 mr-2" />
              Start Collection
            </Button>
          ) : (
            <Button onClick={analyzePattern} className="w-full" disabled={text.length < 10}>
              <Eye className="w-4 h-4 mr-2" />
              Analyze ({text.length} chars)
            </Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {collecting && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                <Keyboard className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <p className="text-lg font-bold">{text.length}</p>
                <p className="text-xs text-muted-foreground">Characters</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                <Activity className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <p className="text-lg font-bold">{keyCount}</p>
                <p className="text-xs text-muted-foreground">Key Events</p>
              </div>
            </div>
          )}
          {analysis ? (
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span>Typing Speed</span><span className="font-bold">{analysis.typing_speed} c/s</span></div>
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span>Key Events</span><span className="font-bold">{analysis.key_events}</span></div>
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span>Risk Score</span><span className={`font-bold ${analysis.risk_score < 20 ? 'text-green-400' : 'text-yellow-400'}`}>{analysis.risk_score}%</span></div>
              <div className="flex justify-between p-2 bg-accent/30 rounded"><span>Status</span><Badge className={analysis.recommendation === 'normal' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}>{analysis.recommendation}</Badge></div>
            </div>
          ) : !collecting ? (
            <p className="text-center text-muted-foreground py-8">Start collection to analyze</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

// ============ API REFERENCE ============
const APIReference = () => {
  const [openSections, setOpenSections] = useState(["auth"]);

  const toggleSection = (id) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const apiGroups = [
    { id: "auth", title: "Authentication", icon: Lock, color: "text-green-500", endpoints: [
      { method: "POST", path: "/api/auth/register", desc: "Register new user" },
      { method: "POST", path: "/api/auth/login", desc: "Login and get JWT" },
      { method: "POST", path: "/api/auth/refresh", desc: "Refresh access token" },
      { method: "GET", path: "/api/auth/me", desc: "Get current user" },
      { method: "POST", path: "/api/auth/verify-email", desc: "Verify email token" },
    ]},
    { id: "devices", title: "Devices", icon: Smartphone, color: "text-blue-500", endpoints: [
      { method: "POST", path: "/api/devices/register", desc: "Register new device" },
      { method: "GET", path: "/api/devices/{user_id}", desc: "Get user devices" },
      { method: "DELETE", path: "/api/devices/{device_id}", desc: "Revoke device" },
    ]},
    { id: "webauthn", title: "WebAuthn", icon: Fingerprint, color: "text-purple-500", endpoints: [
      { method: "POST", path: "/api/webauthn/register/options", desc: "Get registration options" },
      { method: "POST", path: "/api/webauthn/register/verify", desc: "Verify registration" },
      { method: "POST", path: "/api/webauthn/authenticate/options", desc: "Get auth options" },
      { method: "POST", path: "/api/webauthn/authenticate/verify", desc: "Verify authentication" },
    ]},
    { id: "transactions", title: "Transactions", icon: Send, color: "text-emerald-500", endpoints: [
      { method: "POST", path: "/api/transactions/create", desc: "Create signed transaction" },
      { method: "POST", path: "/api/transactions/verify", desc: "Verify with biometric" },
      { method: "GET", path: "/api/transactions/{user_id}", desc: "Get user transactions" },
      { method: "POST", path: "/api/transactions/offline/queue", desc: "Queue offline tx" },
      { method: "POST", path: "/api/transactions/offline/sync", desc: "Sync offline transactions" },
    ]},
    { id: "risk", title: "Risk Analysis", icon: Brain, color: "text-yellow-500", endpoints: [
      { method: "POST", path: "/api/risk/analyze", desc: "AI-powered risk scoring" },
    ]},
    { id: "behavioral", title: "Behavioral", icon: Activity, color: "text-pink-500", endpoints: [
      { method: "GET", path: "/api/behavioral/profile", desc: "Get user profile" },
      { method: "POST", path: "/api/behavioral/session", desc: "Submit session data" },
    ]},
    { id: "fraud", title: "Fraud Alerts", icon: AlertTriangle, color: "text-red-500", endpoints: [
      { method: "GET", path: "/api/fraud-alerts", desc: "Get alerts" },
      { method: "PATCH", path: "/api/fraud-alerts/{id}/acknowledge", desc: "Acknowledge alert" },
    ]},
    { id: "audit", title: "Audit Logs", icon: FileText, color: "text-amber-500", endpoints: [
      { method: "GET", path: "/api/audit/logs", desc: "Get audit logs" },
      { method: "GET", path: "/api/audit/verify/{log_id}", desc: "Verify log integrity" },
    ]},
    { id: "apikeys", title: "API Keys", icon: Key, color: "text-cyan-500", endpoints: [
      { method: "POST", path: "/api/api-keys", desc: "Create API key" },
      { method: "GET", path: "/api/api-keys", desc: "List API keys" },
      { method: "DELETE", path: "/api/api-keys/{key_id}", desc: "Revoke key" },
    ]},
    { id: "webhooks", title: "Webhooks", icon: Globe, color: "text-indigo-500", endpoints: [
      { method: "POST", path: "/api/webhooks", desc: "Create webhook" },
      { method: "GET", path: "/api/webhooks", desc: "List webhooks" },
      { method: "POST", path: "/api/webhooks/{id}/test", desc: "Test webhook" },
    ]},
    { id: "billing", title: "Billing", icon: DollarSign, color: "text-green-500", endpoints: [
      { method: "GET", path: "/api/billing/plans", desc: "Get pricing plans" },
      { method: "POST", path: "/api/billing/checkout", desc: "Create checkout session" },
      { method: "GET", path: "/api/billing/subscription", desc: "Get subscription" },
    ]},
  ];

  const methodColors = { GET: "bg-green-500/10 text-green-400", POST: "bg-blue-500/10 text-blue-400", PUT: "bg-yellow-500/10 text-yellow-400", PATCH: "bg-orange-500/10 text-orange-400", DELETE: "bg-red-500/10 text-red-400" };
  const totalEndpoints = apiGroups.reduce((sum, g) => sum + g.endpoints.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="w-5 h-5" />
          API Reference
          <Badge variant="outline" className="ml-2">{totalEndpoints}+ endpoints</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {apiGroups.map((group) => (
            <Collapsible key={group.id} open={openSections.includes(group.id)}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-4 h-auto" onClick={() => toggleSection(group.id)}>
                  <div className="flex items-center gap-3">
                    <group.icon className={`w-5 h-5 ${group.color}`} />
                    <span className="font-medium">{group.title}</span>
                    <Badge variant="outline" className="text-xs">{group.endpoints.length}</Badge>
                  </div>
                  {openSections.includes(group.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-8 pr-4 pb-4 space-y-2">
                  {group.endpoints.map((ep, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded bg-accent/30 text-sm">
                      <Badge className={`${methodColors[ep.method]} font-mono text-xs w-16 justify-center`}>{ep.method}</Badge>
                      <code className="text-xs font-mono flex-1">{ep.path}</code>
                      <span className="text-muted-foreground text-xs hidden md:block">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============ EMAIL CAPTURE MODAL ============
const EmailCaptureModal = ({ open, onOpenChange, triedFeatures, sessionId }) => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/demo/capture-lead`, {
        email,
        company_name: companyName,
        demo_session_id: sessionId,
        features_tried: triedFeatures,
        source: "features_page"
      });
      setSuccess(true);
      toast.success("Progress saved!");
    } catch (error) {
      toast.error("Failed to save. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground mb-4">Check your email for next steps and the integration guide.</p>
            <Button onClick={() => onOpenChange(false)}>Continue Exploring</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Save Your Progress
          </DialogTitle>
          <DialogDescription>
            You've explored {triedFeatures.length} features! Enter your email to save progress and get the integration guide.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company (optional)</Label>
            <Input id="company" placeholder="Your Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
            Save & Get Guide
          </Button>
          <p className="text-xs text-center text-muted-foreground">We'll never spam. Unsubscribe anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============ BOOK DEMO MODAL ============
const BookDemoModal = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({ name: "", email: "", company_name: "", company_size: "", use_case: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.company_name || !formData.company_size) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/demo/book-call`, formData);
      setSuccess(true);
      toast.success("Demo request submitted!");
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Demo Request Received!</h3>
            <p className="text-muted-foreground mb-4">Our team will reach out within 24 hours to schedule your call.</p>
            <Button onClick={() => onOpenChange(false)}>Got It</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Book a Personalized Demo
          </DialogTitle>
          <DialogDescription>
            Talk to our team about enterprise features, custom integrations, and volume pricing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input placeholder="John Smith" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Work Email *</Label>
              <Input type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input placeholder="Acme Inc" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Company Size *</Label>
              <Select value={formData.company_size} onValueChange={(v) => setFormData({...formData, company_size: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="200+">200+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Use Case</Label>
            <Input placeholder="e.g., Payment authorization for mobile banking" value={formData.use_case} onChange={(e) => setFormData({...formData, use_case: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Message (optional)</Label>
            <textarea className="w-full h-20 p-3 rounded-lg bg-muted border border-border resize-none text-sm" placeholder="Any specific requirements or questions?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
            Request Demo Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============ SUCCESS CTA ============
const SuccessCTA = ({ featureName }) => (
  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/30 animate-fade-in">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="font-medium">Great! You just tested {featureName}</span>
      </div>
      <Link to="/solutions/biosign/demo">
        <Button size="sm" className="glow-green">
          Get API Keys
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  </div>
);

// ============ MAIN FEATURES PAGE ============
const BioSignFeaturesPage = () => {
  const { session, loading: sessionLoading, getAuthHeaders } = useDemoSession();
  const { triedFeatures, markFeatureTried, progress } = useProgressTracker();
  const [activeTab, setActiveTab] = useState("webauthn");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showBookDemo, setShowBookDemo] = useState(false);
  const [lastSuccess, setLastSuccess] = useState(null);
  const emailCaptureShown = useRef(false);

  // Show email capture after 3 features
  useEffect(() => {
    if (progress >= 3 && !emailCaptureShown.current) {
      const hasEmail = localStorage.getItem('biosign_lead_captured');
      if (!hasEmail) {
        setTimeout(() => setShowEmailCapture(true), 1500);
        emailCaptureShown.current = true;
      }
    }
  }, [progress]);

  const handleDemoSuccess = (featureId, featureName) => {
    markFeatureTried(featureId);
    setLastSuccess({ id: featureId, name: featureName });
    setTimeout(() => setLastSuccess(null), 5000);
  };

  const trustBadges = [
    { label: "PSD2 Compliant", icon: CheckCircle2 },
    { label: "PCI DSS 4.0", icon: Shield },
    { label: "FIDO2 Certified", icon: Fingerprint },
    { label: "ISO 27001", icon: Lock },
    { label: "SOC 2 Type II", icon: FileText },
    { label: "GDPR", icon: Eye },
  ];

  const demoTabs = [
    { id: "webauthn", label: "WebAuthn", icon: Fingerprint, color: "text-green-500", name: "Biometric Login" },
    { id: "device", label: "Device", icon: Smartphone, color: "text-blue-500", name: "Device Binding" },
    { id: "transaction", label: "Transaction", icon: Send, color: "text-emerald-500", name: "Transaction Signing" },
    { id: "risk", label: "Risk Analysis", icon: Brain, color: "text-purple-500", name: "AI Risk Analysis" },
    { id: "audit", label: "Audit Logs", icon: FileText, color: "text-amber-500", name: "Audit Logging" },
    { id: "offline", label: "Offline", icon: WifiOff, color: "text-cyan-500", name: "Offline Sync" },
    { id: "fraud", label: "Fraud Alerts", icon: AlertTriangle, color: "text-red-500", name: "Fraud Detection" },
    { id: "behavioral", label: "Behavioral", icon: Activity, color: "text-pink-500", name: "Behavioral Analysis" },
  ];

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Preparing your demo environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="features-page">
      <BioSignNavbar />

      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{progress}/8 features explored</span>
              <Progress value={(progress / 8) * 100} className="w-32 h-2" />
            </div>
            <div className="flex items-center gap-2">
              {progress >= 3 && (
                <Button size="sm" variant="outline" onClick={() => setShowEmailCapture(true)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
              )}
              <Link to="/solutions/biosign/demo">
                <Button size="sm">Get API Keys</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            <Zap className="w-3 h-3 mr-1" />
            8 Interactive Demos • 50+ API Endpoints
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Try Every Feature <span className="text-primary">Right Now</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            No signup required. Your demo session is ready. Explore bank-grade security features live.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 border border-border/50 text-sm">
                <badge.icon className="w-3.5 h-3.5 text-green-500" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo Tabs */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Interactive Demos
            </h2>
            <div className="flex gap-1">
              {demoTabs.map((tab) => (
                <div key={tab.id} className={`w-3 h-3 rounded-full transition-colors ${triedFeatures.includes(tab.id) ? 'bg-green-500' : 'bg-muted'}`} title={tab.label} />
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
              {demoTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:border-primary relative transition-all"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {triedFeatures.includes(tab.id) && (
                    <CheckCircle className="w-3 h-3 text-green-500 absolute -top-1 -right-1" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="webauthn" className="mt-0">
              <WebAuthnDemo onSuccess={() => handleDemoSuccess("webauthn", "Biometric Login")} getAuthHeaders={getAuthHeaders} />
              {lastSuccess?.id === "webauthn" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="device" className="mt-0">
              <DeviceDemo onSuccess={() => handleDemoSuccess("device", "Device Binding")} getAuthHeaders={getAuthHeaders} />
              {lastSuccess?.id === "device" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="transaction" className="mt-0">
              <TransactionDemo onSuccess={() => handleDemoSuccess("transaction", "Transaction Signing")} getAuthHeaders={getAuthHeaders} />
              {lastSuccess?.id === "transaction" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="risk" className="mt-0">
              <RiskDemo onSuccess={() => handleDemoSuccess("risk", "AI Risk Analysis")} />
              {lastSuccess?.id === "risk" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="audit" className="mt-0">
              <AuditDemo onSuccess={() => handleDemoSuccess("audit", "Audit Logging")} />
              {lastSuccess?.id === "audit" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="offline" className="mt-0">
              <OfflineDemo onSuccess={() => handleDemoSuccess("offline", "Offline Sync")} />
              {lastSuccess?.id === "offline" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="fraud" className="mt-0">
              <FraudDemo onSuccess={() => handleDemoSuccess("fraud", "Fraud Detection")} />
              {lastSuccess?.id === "fraud" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
            <TabsContent value="behavioral" className="mt-0">
              <BehavioralDemo onSuccess={() => handleDemoSuccess("behavioral", "Behavioral Analysis")} />
              {lastSuccess?.id === "behavioral" && <SuccessCTA featureName={lastSuccess.name} />}
            </TabsContent>
          </Tabs>
        </div>

        {/* API Reference */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            API Reference
          </h2>
          <APIReference />
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-b from-primary/10 to-transparent border-primary/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Integrate?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Get your API keys and start building in minutes. Need help with enterprise features?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/solutions/biosign/demo">
                <Button size="lg" className="glow-green">
                  Get API Keys
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => setShowBookDemo(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                Book Enterprise Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Book Demo Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="shadow-lg rounded-full pl-4 pr-5 gap-2" onClick={() => setShowBookDemo(true)}>
          <MessageSquare className="w-5 h-5" />
          Talk to Sales
        </Button>
      </div>

      {/* Modals */}
      <EmailCaptureModal 
        open={showEmailCapture} 
        onOpenChange={(open) => {
          setShowEmailCapture(open);
          if (!open) localStorage.setItem('biosign_lead_captured', 'true');
        }}
        triedFeatures={triedFeatures}
        sessionId={session?.session_id}
      />
      <BookDemoModal open={showBookDemo} onOpenChange={setShowBookDemo} />
    </div>
  );
};

export default BioSignFeaturesPage;
