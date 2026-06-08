interface BadgeProps {
  label: string;
  colorClass: string;
}

export const Badge = ({ label, colorClass }: BadgeProps) => (
  <span className={`badge ${colorClass}`}>{label}</span>
);
