import { useState } from 'react';
import axios from 'axios';

export default function UrlForm() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate custom code (alphanumeric + _ and - only)
  const isValidCustomCode = (code) => /^[a-zA-Z0-9_-]+$/.test(code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Invalid URL format');
      return;
    }

    if (customCode && !isValidCustomCode(customCode)) {
      setError('Custom code can only contain letters, numbers, underscores, and dashes');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/shorten', {
        longUrl,
        customCode: customCode || undefined,
      });

      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to shorten URL');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', paddingTop: '40px' }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
          required
        />
        <input
          type="text"
          placeholder="Custom short code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
          maxLength={20}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Loading...' : 'Shorten'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {shortUrl && (
        <p style={{ marginTop: '15px' }}>
          Short URL:{' '}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}
