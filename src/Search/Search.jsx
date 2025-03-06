import React, { useState } from 'react';
import axios from 'axios';
import styles from './Search.module.css';

function Search() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const instanceUrl = 'https://invidious.nerdvpn.de';
  const corsProxy = 'https://cors-proxy.io';

  const searchVideos = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${corsProxy}/${instanceUrl}/api/v1/search`, {
        params: {
          q: query,
          type: 'video'
        },
        headers: {
          'Accept': 'application/json',
          'x-requested-with': 'XMLHttpRequest'
        }
      });
      console.log(response.data);
      // TODO: Handle the search results
    } catch (error) {
      setError('Failed to search videos. Please try again later.');
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          disabled={loading}
        />
        <button 
          onClick={searchVideos} 
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Search;