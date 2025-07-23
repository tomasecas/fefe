import React, { useState, useEffect } from 'react';
import { Product, Service, Order, ContactMessage } from '../types';
import { Plus, Edit2, Trash2, Package, DollarSign, MessageSquare, ShoppingCart, Eye, CheckCircle, Clock, Truck } from 'lucide-react';
import { supabase } from '../config/supabase';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'orders' | 'messages'>('products');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'tortas' as Product['category'],
    image_url: '',
    available: true
  });

  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    icon: 'heart',
    active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, servicesRes, ordersRes, messagesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('display_order'),
        supabase.from('orders').select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            unit_price,
            total_price
          )
        `).order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      if (productsRes.error) throw productsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (messagesRes.error) throw messagesRes.error;

      setProducts(productsRes.data || []);
      setServices(servicesRes.data || []);
      setOrders(ordersRes.data || []);
      setMessages(messagesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        
        if (error) throw error;
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceFormData)
          .eq('id', editingService.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceFormData]);
        
        if (error) throw error;
      }
      
      await fetchData();
      resetServiceForm();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      available: product.available
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (error) throw error;
        await fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleServiceEdit = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      description: service.description,
      image_url: service.image_url,
      icon: service.icon,
      active: service.active,
      display_order: service.display_order
    });
    setShowForm(true);
  };

  const handleServiceDelete = async (serviceId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', serviceId);
        
        if (error) throw error;
        await fetchData();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateMessageStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'tortas',
      image_url: '',
      available: true
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const resetServiceForm = () => {
    setServiceFormData({
      title: '',
      description: '',
      image_url: '',
      icon: 'heart',
      active: true,
      display_order: 0
    });
    setEditingService(null);
    setShowForm(false);
  };

  const categories = [
    { value: 'tortas', label: 'Tortas' },
    { value: 'cupcakes', label: 'Cupcakes' },
    { value: 'postres', label: 'Postres' },
    { value: 'panes', label: 'Panes' },
    { value: 'otros', label: 'Otros' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-6">Panel de Administración</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package className="inline h-4 w-4 mr-2" />
              Productos ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'services' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <DollarSign className="inline h-4 w-4 mr-2" />
              Servicios ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-white text-pink-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ShoppingCart className="inline h-4 w-4 mr-2" />
              Pedidos ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'messages' 
                  ? 'bg-white text-pink-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="inline h-4 w-4 mr-2" />
              Mensajes ({messages.filter(m => m.status === 'pending').length})
            </button>
          </div>

          {/* Add Button */}
          {(activeTab === 'products' || activeTab === 'services') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo {activeTab === 'products' ? 'Producto' : 'Servicio'}</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pedidos Pendientes</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Mensajes Sin Leer</p>
                <p className="text-2xl font-bold text-gray-800">
                  {messages.filter(m => m.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${orders
                    .filter(o => o.status === 'delivered' && new Date(o.created_at).getMonth() === new Date().getMonth())
                    .reduce((sum, o) => sum + o.total_amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && activeTab === 'products' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la imagen
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                    Producto disponible
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service Form Modal */}
        {showForm && activeTab === 'services' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del servicio
                  </label>
                  <input
                    type="text"
                    value={serviceFormData.title}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={serviceFormData.description}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icono
                    </label>
                    <select
                      value={serviceFormData.icon}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="heart">Corazón</option>
                      <option value="users">Usuarios</option>
                      <option value="sparkles">Estrellas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden de visualización
                    </label>
                    <input
                      type="number"
                      value={serviceFormData.display_order}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, display_order: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la imagen
                  </label>
                  <input
                    type="url"
                    value={serviceFormData.image_url}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={serviceFormData.active}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, active: e.target.checked })}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Servicio activo
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    {editingService ? 'Actualizar' : 'Crear'} Servicio
                  </button>
                  <button
                    type="button"
                    onClick={resetServiceForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-500 mb-2">No hay productos</h3>
              <p className="text-gray-400">Crea tu primer producto para comenzar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image_url || 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-primary-500 font-bold">${product.price.toLocaleString()}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.available ? 'Disponible' : 'No disponible'}
                        </span>
                        <span className="text-gray-500 text-xs capitalize">
                          {categories.find(c => c.value === product.category)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Servicios</h2>
            </div>
            
            {services.length === 0 ? (
              <div className="p-8 text-center">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg text-gray-500 mb-2">No hay servicios</h3>
                <p className="text-gray-400">Crea tu primer servicio para comenzar</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {services.map((service) => (
                  <div key={service.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={service.image_url || 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=200'}
                        alt={service.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{service.title}</h3>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {service.active ? 'Activo' : 'Inactivo'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            Orden: {service.display_order}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleServiceEdit(service)}
                        className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleServiceDelete(service.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Pedidos</h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg text-gray-500 mb-2">No hay pedidos</h3>
                <p className="text-gray-400">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">Pedido #{order.id.slice(0, 8)}</h3>
                        <p className="text-gray-600 text-sm">{order.customer_name} - {order.customer_email}</p>
                        <p className="text-gray-600 text-sm">{order.customer_phone}</p>
                        {order.delivery_date && (
                          <p className="text-gray-600 text-sm">Entrega: {new Date(order.delivery_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-pink-500">${order.total_amount.toLocaleString()}</p>
                        <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {order.order_items && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Productos:</h4>
                        <div className="space-y-1">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm text-gray-600">
                              <span>{item.quantity}x {item.product_name}</span>
                              <span>${item.total_price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-1">Notas:</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                        {order.status === 'pending' && 'Pendiente'}
                        {order.status === 'confirmed' && 'Confirmado'}
                        {order.status === 'preparing' && 'Preparando'}
                        {order.status === 'ready' && 'Listo'}
                        {order.status === 'delivered' && 'Entregado'}
                        {order.status === 'cancelled' && 'Cancelado'}
                      </span>
                      
                      <div className="flex space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="preparing">Preparando</option>
                          <option value="ready">Listo</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Mensajes de Contacto</h2>
            </div>
            
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg text-gray-500 mb-2">No hay mensajes</h3>
                <p className="text-gray-400">Los mensajes de contacto aparecerán aquí</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div key={message.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{message.name}</h3>
                        <p className="text-gray-600 text-sm">{message.email}</p>
                        {message.phone && <p className="text-gray-600 text-sm">{message.phone}</p>}
                        <p className="text-gray-500 text-sm">{new Date(message.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(message.status)}`}>
                        {message.status === 'pending' && 'Pendiente'}
                        {message.status === 'read' && 'Leído'}
                        {message.status === 'replied' && 'Respondido'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Asunto: {message.subject}</h4>
                      <p className="text-gray-600">{message.message}</p>
                    </div>

                    <div className="flex space-x-2">
                      <select
                        value={message.status}
                        onChange={(e) => updateMessageStatus(message.id, e.target.value as ContactMessage['status'])}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="read">Leído</option>
                        <option value="replied">Respondido</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;