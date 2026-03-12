import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50 mt-auto">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>COMPIA Editora</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Publicações especializadas em Inteligência Artificial para estudantes e profissionais.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Categorias</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/catalogo?category=Deep+Learning" className="hover:text-foreground">Deep Learning</Link>
            <Link to="/catalogo?category=Machine+Learning" className="hover:text-foreground">Machine Learning</Link>
            <Link to="/catalogo?category=NLP" className="hover:text-foreground">NLP</Link>
            <Link to="/catalogo?category=Bundles" className="hover:text-foreground">Bundles</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Institucional</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Sobre nós</span>
            <span>Política de privacidade</span>
            <span>Termos de uso</span>
            <span>Contato</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Atendimento</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>contato@compiaeditora.com.br</span>
            <span>(11) 3000-0000</span>
            <span>Seg a Sex, 9h às 18h</span>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2025 COMPIA Editora. Projeto acadêmico. Todos os direitos reservados.
      </div>
    </footer>
  );
}
