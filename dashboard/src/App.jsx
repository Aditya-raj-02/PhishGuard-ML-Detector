import { useState } from 'react';
import { Shield, AlertTriangle, Search, CheckCircle, ServerCrash } from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Talking to your FastAPI Backend!
      const response = await fetch('http://127.0.0.1:8000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) throw new Error('Server error');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Could not connect to backend. Is your FastAPI server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
          <Shield size={40} color="#3b82f6" />
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>PhishGuard <span style={{ color: '#3b82f6' }}>Analyst</span></h1>
        </div>

        {/* Search Bar */}
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem', color: '#cbd5e1' }}>Manual URL Scanner</h2>
          <form onSubmit={handleScan} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Enter a website URL (e.g., https://example.com)" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '1rem' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '0 25px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
            >
              <Search size={20} />
              {loading ? 'Scanning...' : 'Analyze'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#7f1d1d', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ServerCrash size={24} color="#fca5a5" />
            <p style={{ margin: 0, color: '#fca5a5', fontWeight: 'bold' }}>{error}</p>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div style={{ marginTop: '20px', padding: '30px', backgroundColor: '#1e293b', borderRadius: '12px', border: `2px solid ${result.is_malicious ? '#ef4444' : '#22c55e'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px' }}>
              {result.is_malicious ? <AlertTriangle size={36} color="#ef4444" /> : <CheckCircle size={36} color="#22c55e" />}
              <div>
                <h2 style={{ margin: 0, color: result.is_malicious ? '#ef4444' : '#22c55e' }}>
                  {result.is_malicious ? 'CRITICAL THREAT DETECTED' : 'SAFE SITE VERIFIED'}
                </h2>
                <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Target: {result.url}</p>
              </div>
            </div>
            
            <div>
              <h3 style={{ color: '#cbd5e1', marginBottom: '10px' }}>AI Confidence Score</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ flex: 1, height: '20px', backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.risk_score}%`, backgroundColor: result.is_malicious ? '#ef4444' : '#22c55e', transition: 'width 0.5s ease' }}></div>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.risk_score}%</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}