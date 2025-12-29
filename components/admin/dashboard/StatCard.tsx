import Link from 'next/link';

interface StatCardProps {
  stat: {
    title: string;
    value: number;
    icon: string;
    color: string;
    href: string;
  };
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <Link
      href={stat.href}
      className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
            <i className={`bi ${stat.icon} text-xl`}></i>
          </div>

          {/* Arrow icon */}
          <i className="bi bi-arrow-right text-gray-400 group-hover:text-hadona-primary group-hover:translate-x-1 transition-all duration-300"></i>
        </div>

        {/* Value */}
        <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>

        {/* Title */}
        <div className="text-sm font-semibold text-gray-600">{stat.title}</div>
      </div>
    </Link>
  );
}
