import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-500">Fefe Pasteleria</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-500 border-b-2 border-primary-500 pb-1' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/productos"
              className={`text-sm font-medium transition-colors ${
                isActive('/productos') 
                  ? 'text-primary-500 border-b-2 border-primary-500 pb-1' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              Productos
            </Link>
            <Link
              to="/contacto"
              className={`text-sm font-medium transition-colors ${
                isActive('/contacto') 
                  ? 'text-primary-500 border-b-2 border-primary-500 pb-1' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              Contacto
            </Link>
            
            <Link
              to="/carrito"
              className={`relative text-sm font-medium transition-colors ${
                isActive('/carrito') 
                  ? 'text-primary-500 border-b-2 border-primary-500 pb-1' 
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              <div className="flex items-center space-x-1">
                <ShoppingCart className="h-4 w-4" />
                <span>Carrito</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'text-primary-500 border-b-2 border-primary-500 pb-1' 
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  Administrar
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Salir</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Iniciar Sesión</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-primary-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;