import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(loginData.email, loginData.password);
    setLoading(false);
    if (ok) {
      toast({ title: 'Bem-vindo!' });
      navigate(loginData.email === 'admin@compia.com' ? '/admin' : '/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register(registerData.name, registerData.email, registerData.password);
    setLoading(false);
    if (ok) {
      toast({ title: 'Conta criada com sucesso!' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 font-display text-2xl font-bold">
            <BookOpen className="h-7 w-7 text-primary" />
            COMPIA Editora
          </div>
          <p className="text-sm text-muted-foreground">Entre ou crie sua conta</p>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="login" className="flex-1">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div><Label>E-mail</Label><Input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required /></div>
                <div><Label>Senha</Label><Input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required /></div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Entrar
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Use <strong>admin@compia.com</strong> para acessar o painel admin
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div><Label>Nome</Label><Input value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required /></div>
                <div><Label>E-mail</Label><Input type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required /></div>
                <div><Label>Senha</Label><Input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required /></div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
