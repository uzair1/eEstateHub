export const formatPrice = (price, status = 'For Sale') => {
  if (status === 'For Rent') return `$${Number(price).toLocaleString()}/mo`;
  if (Number(price) >= 1_000_000) return `$${(Number(price) / 1_000_000).toFixed(2)}M`;
  return `$${Number(price).toLocaleString()}`;
};

export const formatNumber = (n) => Number(n || 0).toLocaleString();

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const timeAgo = (iso) => {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days <= 0) return 'Listed today';
  if (days === 1) return 'Listed yesterday';
  if (days < 30) return `Listed ${days} days ago`;
  return `Listed ${Math.floor(days / 30)} month${days < 60 ? '' : 's'} ago`;
};

export const statusClass = (status) =>
  status === 'Sold' ? 'sold' : status === 'For Rent' ? 'rent' : 'sale';

export const monthlyPayment = ({ price, downPct = 20, rate = 6.5, years = 30 }) => {
  const principal = price * (1 - downPct / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  if (!r) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
};