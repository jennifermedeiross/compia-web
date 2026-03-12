import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, LogOut, BookOpen, ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Produtos', icon: Package, path: '/admin/produtos' },
  { label: 'Pedidos', icon: ShoppingCart, path: '/admin/pedidos' },
  { label: 'Clientes', icon: Users, path: '/admin/clientes' },
  { label: 'Categorias', icon: FolderOpen, path: '/admin/categorias' },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!user || user.role !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200`}>
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 text-sidebar-foreground">
              <BookOpen className="h-5 w-5 text-sidebar-primary" />
              <span className="font-display text-sm font-bold">COMPIA Admin</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:text-sidebar-primary-foreground">
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center px-6 bg-background">
          <h2 className="font-semibold text-sm">Painel Administrativo</h2>
          <span className="ml-auto text-xs text-muted-foreground">{user.name}</span>
        </header>
        <main className="flex-1 p-6 bg-secondary/20 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
