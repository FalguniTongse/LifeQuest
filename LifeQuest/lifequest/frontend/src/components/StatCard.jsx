export default function StatCard({ label, value, tone }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value${tone ? ` ${tone}` : ''}`}>{value}</div>
    </div>
  );
}
