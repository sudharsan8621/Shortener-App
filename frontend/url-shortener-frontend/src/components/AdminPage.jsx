import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/urls')
      .then(res => setUrls(res.data))
      .catch(() => setError('Failed to fetch URLs'));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Admin: All Shortened URLs</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ margin: 'auto' }}>
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {urls.map(({ _id, shortCode, longUrl, clicks }) => (
            <tr key={_id}>
              <td>{shortCode}</td>
              <td><a href={longUrl} target="_blank" rel="noopener noreferrer">{longUrl}</a></td>
              <td>
                <a href={`http://localhost:5000/${shortCode}`} target="_blank" rel="noopener noreferrer">
                  {`http://localhost:5000/${shortCode}`}
                </a>
              </td>
              <td>{clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
