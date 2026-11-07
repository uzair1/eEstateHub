const P = {
  home: 'M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z',
  key: 'M14 7a4 4 0 1 1-3.9 5H8v3H5v3H2v-4l6.1-6.1A4 4 0 0 1 14 7z',
  chart: 'M3 3v18h18M7 15l4-5 3 3 5-7',
  users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8',
  handshake: 'M11 17l2 2a1 1 0 0 0 1.4 0l3.6-3.6M8 13l-3 3 4 4 3-3M15 6l3-3 5 5-3 3-2-2-4 4-3-3',
  ruler: 'M2 14l8-8 8 8-8 8zM6 10l2 2M9 7l2 2M12 10l2 2',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  heart: 'M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z',
  bed: 'M2 20v-8h20v8M2 12V8M2 16h20M6 12V9h6v3M14 12V9h4a4 4 0 0 1 4 3',
  bath: 'M4 12V6a2 2 0 0 1 3.5-1.3M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 19l-1 3M18 19l1 3',
  area: 'M3 3h18v18H3zM3 9h18M9 3v18',
  pin: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  star: 'M12 2l3 6.6 7 .9-5.2 4.8 1.4 7-6.2-3.5L5.8 21l1.4-7L2 9.5l7-.9z',
  check: 'M20 6L9 17l-5-5',
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M18 6L6 18M6 6l12 12',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chat: 'M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z',
  shield: 'M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.2 14L7 22l5-3 5 3-1.2-8',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  gauge: 'M12 20a8 8 0 1 0-8-8M12 12l5-3M4 20h16',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z',
  twitter: 'M22 5.9c-.8.4-1.6.6-2.5.7a4.3 4.3 0 0 0 1.9-2.4c-.8.5-1.8.9-2.8 1.1a4.3 4.3 0 0 0-7.3 3.9A12.2 12.2 0 0 1 3 4.7a4.3 4.3 0 0 0 1.3 5.7c-.7 0-1.3-.2-1.9-.5a4.3 4.3 0 0 0 3.4 4.2c-.6.2-1.2.2-1.9.1a4.3 4.3 0 0 0 4 3A8.6 8.6 0 0 1 2 18.3a12.1 12.1 0 0 0 6.6 1.9c7.9 0 12.3-6.6 12.3-12.3v-.6c.8-.6 1.6-1.3 2.1-2.2z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  linkedin: 'M6 9v11M6 5v.01M11 20V9M11 13a4 4 0 0 1 8 0v7',
  car: 'M5 17h14M6 17v2M18 17v2M4 12l2-5h12l2 5v5H4zM7 14h.01M17 14h.01',
  calendar: 'M5 5h14v16H5zM5 10h14M9 3v4M15 3v4',
  filter: 'M3 5h18l-7 8v6l-4 2v-8z',
};

export default function Icon({ name, size = 20, stroke = 'currentColor', fill = 'none', className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={P[name] || P.home} />
    </svg>
  );
}

export const StarRow = ({ rating = 5, size = 15 }) => (
  <span className="stars" aria-label={`${rating} out of 5 stars`}>
    {'★'.repeat(Math.round(rating))}
    <span style={{ opacity: 0.35 }}>{'★'.repeat(5 - Math.round(rating))}</span>
  </span>
);