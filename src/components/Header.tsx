import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, BookOpen } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>COMPIA</span>
            <span className="text-primary">Editora</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">Catálogo</Link>
            <Link to="/catalogo?category=Deep+Learning" className="text-muted-foreground hover:text-foreground transition-colors">Deep Learning</Link>
            <Link to="/catalogo?category=Machine+Learning" className="text-muted-foreground hover:text-foreground transition-colors">Machine Learning</Link>
            <Link to="/catalogo?category=NLP" className="text-muted-foreground hover:text-foreground transition-colors">NLP</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livros..."
                className="h-9 w-48 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </button>
          )}

          <Link to="/carrinho" className="relative text-muted-foreground hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {itemCount}
              </Badge>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === 'ADMIN' && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Link to="/conta">
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t p-4 flex flex-col gap-3 bg-background">
          <Link to="/catalogo" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Catálogo</Link>
          <Link to="/catalogo?category=Deep+Learning" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Deep Learning</Link>
          <Link to="/catalogo?category=Machine+Learning" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Machine Learning</Link>
          <Link to="/catalogo?category=NLP" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">NLP</Link>
        </nav>
      )}
    </header>
  );
}
