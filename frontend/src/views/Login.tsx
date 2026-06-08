import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter text-primary mb-2">POLLA MUNDIAL</h1>
          <p className="text-muted-foreground">Ingresa para predecir los resultados</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          
          <Link to="/dashboard" className="w-full block mt-6">
            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg px-4 py-3 transition-colors">
              Entrar
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
