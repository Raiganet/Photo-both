'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Camera, Image, Palette, FolderOpen, CreditCard,
  BarChart3, Settings, Users, Ticket, Package, Cloud, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Camera, label: 'Start Booth', href: '/booth', highlight: true },
  { icon: Image, label: 'Templates', href: '/templates' },
  { icon: Palette, label: 'Frame Designer', href: '/frame-editor' },
  { icon: FolderOpen, label: 'Gallery', href: '/gallery' },
  { icon: CreditCard, label: 'Payment', href: '/payment' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Package, label: 'Packages', href: '/packages' },
  { icon: Ticket, label: 'Vouchers', href: '/vouchers' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Cloud, label: 'Cloud Backup', href: '/cloud' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 glass-strong border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">PhotoBooth</h1>
            <p className="text-xs text-muted-foreground">Enterprise</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                isActive ? 'text-primary font-semibold' : 'text-foreground/70 hover:text-foreground hover:bg-accent/50',
                item.highlight && !isActive && 'text-primary'
              )}>
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-muted-foreground">Pro Plan Active</p>
          <p className="text-sm font-semibold mt-1">Unlimited Access</p>
        </div>
      </div>
    </aside>
  );
}
