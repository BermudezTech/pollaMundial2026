import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Trophy, LogOut, Menu, Calculator, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Fases', href: '/fases', icon: Trophy },
    { name: 'Detalles de Puntos', href: '/detalles-puntos', icon: Calculator },
    { name: 'Reglas de la Polla', href: '/reglas', icon: ScrollText },
  ];

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 p-4 shrink-0">
        <div className="text-2xl font-black italic tracking-tighter text-primary mb-8 mt-4 px-2">
          POLLA MUNDIAL
        </div>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </Link>
          <div className="mt-4 px-2 border-t border-border pt-4 flex justify-between items-center text-sm text-muted-foreground">
            Tema
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 sticky top-0 z-50 backdrop-blur-md">
          <div className="text-xl font-black italic tracking-tighter text-primary">
            POLLA MUNDIAL
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Link to="/login" className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground mt-4 border-t border-border">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
