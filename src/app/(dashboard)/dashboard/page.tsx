import { GlassCard } from '@/components/shared/GlassCard';
import { Camera, DollarSign, Image, Users, TrendingUp, Download } from 'lucide-react';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: 'Rp 24.5M', change: '+12.5%', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { label: 'Sessions Today', value: '148', change: '+8.2%', icon: Camera, color: 'from-blue-500 to-cyan-600' },
    { label: 'Photos Captured', value: '2,847', change: '+23.1%', icon: Image, color: 'from-purple-500 to-pink-600' },
    { label: 'Active Users', value: '56', change: '+4.3%', icon: Users, color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang kembali! Berikut ringkasan bisnis Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} className="relative overflow-hidden">
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <DashboardChart />
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Start Photo Booth', icon: Camera, href: '/booth' },
              { label: 'View Gallery', icon: Image, href: '/gallery' },
              { label: 'Download Report', icon: Download, href: '#' },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Recent Transactions */}
      <GlassCard>
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <RecentTransactions />
      </GlassCard>
    </div>
  );
}
