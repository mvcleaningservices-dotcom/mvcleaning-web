import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Search, Users } from 'lucide-react';
import { adminApi, type AdminCustomer } from '../../api';

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (search?: string) => {
    setLoading(true);
    setError('');
    adminApi.listCustomers(search)
      .then(setCustomers)
      .catch(e => setError((e as Error).message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(val.trim() || undefined), 350);
  };

  return (
    <div className="adm-page">
      <div className="adm-breadcrumb">
        <span>MV Cleaning</span>
        <ChevronRight size={14} />
        <span>Customers</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <h1 className="adm-page-title" style={{ margin: 0 }}>Customer Database</h1>
        <div className="adm-search-wrap">
          <Search size={15} className="adm-search-icon" />
          <input
            className="adm-search-input"
            placeholder="Search name or phone…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />
          <button className="adm-btn-primary" style={{ padding: '8px 18px' }} onClick={() => load(query.trim() || undefined)}>
            Search
          </button>
        </div>
      </div>

      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="adm-table-empty">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="adm-skeleton-row" />
            ))}
          </div>
        ) : error ? (
          <div className="adm-table-empty">
            <p style={{ color: '#ef4444' }}>{error}</p>
            <button className="adm-btn-primary" style={{ marginTop: 8 }} onClick={() => load()}>Retry</button>
          </div>
        ) : customers.length === 0 ? (
          <div className="adm-table-empty">
            <Users size={36} strokeWidth={1.5} style={{ color: '#cbd5e1', marginBottom: 8 }} />
            <p style={{ color: '#94a3b8' }}>No customers found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Orders</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td className="adm-td-name">{c.username}</td>
                    <td className="adm-td-phone">{c.phone}</td>
                    <td className="adm-td-location">{c.location || <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                    <td>{c.noOfOrders}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{fmt(c.lastLogin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
