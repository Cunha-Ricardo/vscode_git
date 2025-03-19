
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Página não encontrada</h2>
          <p className="text-gray-600">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate("/dashboard")}
          className="mt-8 flex items-center"
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
