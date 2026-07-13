import { useState, useMemo } from 'react';
import './App.css';
import rawData from './data.json';

function App() {
  const [selectedMatan, setSelectedMatan] = useState(Object.keys(rawData)[0] || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract the list of matans (topics)
  const matans = Object.keys(rawData);

  // Filter the participants based on search query
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const participants = rawData[selectedMatan] || [];
    const query = searchQuery.toLowerCase();
    
    return participants.filter(p => p.name.toLowerCase().includes(query));
  }, [searchQuery, selectedMatan]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Cek Kelompok Hafalan</h1>
        <p>Temukan kelompok dan Mualim Anda tanpa perlu membagikan data pribadi.</p>
      </header>

      <main>
        <div className="search-container">
          <div className="input-group">
            <label htmlFor="matan">Pilih Matan / Kitab</label>
            <select 
              id="matan"
              value={selectedMatan} 
              onChange={(e) => {
                setSelectedMatan(e.target.value);
                setSearchQuery(''); // Reset search on matan change
              }}
            >
              {matans.map(matan => (
                <option key={matan} value={matan}>
                  {matan.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="search">Cari Nama Anda</label>
            <input 
              id="search"
              type="text" 
              placeholder="Masukkan nama lengkap atau panggilan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="results-area">
          {searchQuery.trim() === '' ? (
            <div className="no-results">
              Silakan masukkan nama Anda untuk melihat detail kelompok.
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="result-card">
                <div className="result-info">
                  <h3>{result.name}</h3>
                  {result.nip && <p>NIP: {result.nip}</p>}
                </div>
                <div className="result-group">
                  <span className="group-badge">Kelompok {result.kelompok}</span>
                  <p className="mualim-name">Mualim: {result.mualim}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              Tidak ditemukan peserta dengan nama "{searchQuery}" pada matan ini.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
