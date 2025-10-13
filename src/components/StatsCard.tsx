import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function StatsCard({ title, value, icon: Icon, color, bgColor }: StatsCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 p-6 shadow-sm hover:shadow-md hover:shadow-purple-100 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-600 mb-1">{title}</p>
          <h2 className="text-purple-900">{value}</h2>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}
