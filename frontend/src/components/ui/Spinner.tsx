export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' }) => (
  <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
);
