import React from 'react';

const ColorDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">🎨 Colores Actuales de la Aplicación</h2>
      
      {/* Colores Principales */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Rosa (Color Principal)</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-pink-50 p-4 rounded-lg text-center">
            <div className="text-sm font-mono">pink-50</div>
            <div className="text-xs text-gray-600">#fdf2f8</div>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg text-center">
            <div className="text-sm font-mono">pink-100</div>
            <div className="text-xs text-gray-600">#fce7f3</div>
          </div>
          <div className="bg-pink-400 p-4 rounded-lg text-center text-white">
            <div className="text-sm font-mono">pink-400</div>
            <div className="text-xs">#f472b6</div>
          </div>
          <div className="bg-pink-500 p-4 rounded-lg text-center text-white">
            <div className="text-sm font-mono">pink-500</div>
            <div className="text-xs">#ec4899</div>
          </div>
          <div className="bg-pink-600 p-4 rounded-lg text-center text-white">
            <div className="text-sm font-mono">pink-600</div>
            <div className="text-xs">#db2777</div>
          </div>
        </div>
      </div>

      {/* Colores Secundarios */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Grises (Texto y Fondos)</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center border">
            <div className="text-sm font-mono">gray-50</div>
            <div className="text-xs text-gray-600">#f9fafb</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <div className="text-sm font-mono">gray-100</div>
            <div className="text-xs text-gray-600">#f3f4f6</div>
          </div>
          <div className="bg-gray-600 p-4 rounded-lg text-center text-white">
            <div className="text-sm font-mono">gray-600</div>
            <div className="text-xs">#4b5563</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center text-white">
            <div className="text-sm font-mono">gray-800</div>
            <div className="text-xs">#1f2937</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center border">
            <div className="text-sm font-mono">white</div>
            <div className="text-xs text-gray-600">#ffffff</div>
          </div>
        </div>
      </div>

      {/* Ejemplos de Uso */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Ejemplos de Componentes</h3>
        <div className="space-y-4">
          {/* Botón Principal */}
          <button className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors">
            Botón Principal (bg-pink-500)
          </button>
          
          {/* Tarjeta */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h4 className="text-gray-800 font-semibold mb-2">Tarjeta (bg-white)</h4>
            <p className="text-gray-600">Texto secundario (text-gray-600)</p>
            <p className="text-pink-500 font-bold mt-2">Precio destacado (text-pink-500)</p>
          </div>

          {/* Input */}
          <input 
            type="text" 
            placeholder="Input con focus rosa"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorDemo;