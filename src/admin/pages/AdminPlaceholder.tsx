import { Construction } from 'lucide-react';

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="adm-page">
      <div className="adm-placeholder">
        <Construction size={40} strokeWidth={1.5} />
        <h2>{title}</h2>
        <p>This section is coming soon.</p>
      </div>
    </div>
  );
}
