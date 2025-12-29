'use client';

interface AgencyInfo {
  name: string;
  tagline: string;
  description: string;
  vision: string;
  mission: readonly string[] | string[];
  teamSize?: string;
  projectsCompleted?: string;
  yearsExperience?: number;
}

interface AboutSectionProps {
  agencyInfo: AgencyInfo;
}

export function AboutSection({ agencyInfo }: AboutSectionProps) {
  return (
    <section className="animate-fade-in">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-2 bg-hadona-primary/10 text-hadona-primary
                        rounded-full text-sm font-bold mb-4">
          TENTANG KAMI
        </span>
        <h2 className="text-section-title text-gray-900 mb-6">
          {agencyInfo.tagline}
        </h2>
        <p className="text-body text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {agencyInfo.description}
        </p>
      </div>

      {/* Split Layout: Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Vision Card */}
        <div className="card-base bg-gradient-to-br from-hadona-primary/5 to-hadona-light/5
                      border-hadona-primary/20 hover:shadow-xl
                      transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-hadona-primary flex items-center justify-center">
              <i className="bi bi-eye text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Visi Kami</h3>
          </div>
          <p className="text-body text-gray-700 leading-relaxed">
            {agencyInfo.vision}
          </p>
        </div>

        {/* Mission Card */}
        <div className="card-base bg-gradient-to-br from-hadona-yellow/10 to-hadona-yellow-dark/10
                      border-hadona-yellow/30 hover:shadow-xl
                      transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-hadona-yellow flex items-center justify-center">
              <i className="bi bi-bullseye text-3xl text-gray-900"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Misi Kami</h3>
          </div>
          <ul className="space-y-3">
            {agencyInfo.mission.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <i className="bi bi-check-circle-fill text-hadona-primary text-xl mt-1 flex-shrink-0"></i>
                <span className="text-body text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
