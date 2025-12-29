interface MetricCardProps {
  icon?: string;
  label: string;
  value: string;
  color?: string;
}

export function MetricCard({ icon, label, value, color = '#2B46BB' }: MetricCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <i className={`bi ${icon} text-2xl`} style={{ color }}></i>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}
