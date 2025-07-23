import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_date: '',
    delivery_address: '',
    notes: ''
  });
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          total_amount: getTotalPrice(),
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and redirect
      clearCart();
      alert('¡Pedido realizado exitosamente! Te contactaremos pronto para confirmar los detalles.');
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-neutral-400 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">Agrega algunos productos deliciosos a tu carrito</p>
            <button
              onClick={() => navigate('/productos')}
              className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-light text-gray-800 mb-8">Carrito de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Productos ({items.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="p-6 flex items-center space-x-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                      <p className="text-primary-500 font-bold mt-2">${item.product.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Total</span>
                  <span className="text-primary-500">${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Proceder al Checkout
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.customer_name}
                      onChange={(e) => setOrderData({...orderData, customer_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={orderData.customer_email}
                      onChange={(e) => setOrderData({...orderData, customer_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderData.customer_phone}
                      onChange={(e) => setOrderData({...orderData, customer_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Fecha de entrega
                    </label>
                    <input
                      type="date"
                      value={orderData.delivery_date}
                      onChange={(e) => setOrderData({...orderData, delivery_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Dirección de entrega
                    </label>
                    <textarea
                      value={orderData.delivery_address}
                      onChange={(e) => setOrderData({...orderData, delivery_address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas adicionales
                    </label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                      rows={3}
                      placeholder="Instrucciones especiales, alergias, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;