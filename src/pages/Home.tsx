import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Sparkles, ArrowRight, Leaf } from 'lucide-react';
import { supabase } from '../config/supabase';
import { Service } from '../types';

const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('display_order');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="h-12 w-12 text-pink-400" />;
      case 'users':
        return <Users className="h-12 w-12 text-pink-400" />;
      case 'sparkles':
        return <Sparkles className="h-12 w-12 text-pink-400" />;
      default:
        return <Heart className="h-12 w-12 text-pink-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-500 mb-6">
              Fefe Pasteleria
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Cada creación nace con amor, se hornea con pasión             
              y llega a tu mesa para hacer de lo cotidiano, algo inolvidable.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center bg-primary-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Ver Catálogo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Especializados en crear experiencias dulces únicas para cada ocasión especial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6 flex justify-center">
                  <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                    <Leaf className="h-12 w-12 text-primary-500" />
                  </div>
                </div>
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-primary-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-white mb-6">
            ¿Listo para endulzar tu celebración?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Contáctanos para crear juntos el postre perfecto para tu ocasión especial. 
            Cada detalle importa y nosotros nos encargamos de todo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/productos"
              className="bg-white text-primary-500 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Ver Productos
            </Link>
            <Link
              to="/contacto"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-primary-500 transition-colors"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;