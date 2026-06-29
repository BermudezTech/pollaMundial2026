import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Trophy, LogOut, Menu, ScrollText } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Partidos', href: '/fases', icon: Trophy },
    { name: 'Reglas de la Polla', href: '/reglas', icon: ScrollText },
  ];

  const userName = localStorage.getItem('nombre') || localStorage.getItem('user_name') || 'Usuario';

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 p-4 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 mb-8 mt-4 px-2 hover:opacity-85 transition-opacity">
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/250px-2026_FIFA_World_Cup_emblem.svg.png" alt="FIFA 2026" className="w-8 h-8 object-contain shrink-0" />
          <div className="text-2xl font-black italic tracking-tighter text-primary">
            POLLA MUNDIAL
          </div>
        </Link>
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
          {/* User Profile Block */}
          <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-muted/40 border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-black text-primary text-base shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground truncate">{userName}</span>
              <span className="text-xs text-muted-foreground">Participante</span>
            </div>
          </div>

          <Link
            to="/login"
            onClick={() => {
              localStorage.removeItem('user_uuid');
              localStorage.removeItem('user_name');
              localStorage.removeItem('uuid');
              localStorage.removeItem('nombre');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
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
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/250px-2026_FIFA_World_Cup_emblem.svg.png" alt="FIFA 2026" className="w-7 h-7 object-contain shrink-0" />
            <div className="text-xl font-black italic tracking-tighter text-primary">
              POLLA MUNDIAL
            </div>
          </Link>
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

            {/* Mobile User Profile */}
            <div className="flex items-center gap-3 px-3 py-3 mt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-black text-primary text-base shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate">{userName}</span>
                <span className="text-xs text-muted-foreground">Participante</span>
              </div>
            </div>

            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem('user_uuid');
                localStorage.removeItem('user_name');
                localStorage.removeItem('uuid');
                localStorage.removeItem('nombre');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-muted-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background stadium-glow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
