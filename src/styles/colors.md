# 🎨 Guía de Personalización de Colores

## 📍 **Ubicaciones de los Colores**

### **1. Tailwind CSS (Principal)**
Los colores principales están definidos usando las clases de Tailwind CSS. Aquí están los más importantes:

#### **🌸 Rosa (Color Principal)**
- `bg-pink-50` - Fondo muy claro
- `bg-pink-100` - Fondo claro para iconos
- `bg-pink-400` - Gradientes
- `bg-pink-500` - Color principal (botones, enlaces)
- `bg-pink-600` - Hover de botones
- `text-pink-500` - Texto principal
- `border-pink-500` - Bordes y focus

#### **🔘 Grises (Texto y Fondos)**
- `bg-gray-50` - Fondo de páginas
- `bg-gray-100` - Fondos secundarios
- `text-gray-600` - Texto secundario
- `text-gray-800` - Texto principal
- `border-gray-300` - Bordes de inputs

#### **⚪ Blancos**
- `bg-white` - Tarjetas y contenedores
- `text-white` - Texto en botones

### **2. Gradientes Personalizados**
```css
bg-gradient-to-br from-pink-50 to-white
bg-gradient-to-r from-pink-500 to-pink-400
```

## 🛠️ **Cómo Cambiar los Colores**

### **Opción 1: Usar otros colores de Tailwind**
Reemplaza `pink` por otro color disponible:
- `blue`, `green`, `purple`, `red`, `yellow`, `indigo`, `teal`, etc.

Ejemplo: Cambiar a azul
- `bg-pink-500` → `bg-blue-500`
- `text-pink-500` → `text-blue-500`

### **Opción 2: Personalizar en tailwind.config.js**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fdeeff', 
          500: '#d946ef', // Tu color principal
          600: '#c026d3',
        }
      }
    }
  }
}
```

### **Opción 3: CSS Personalizado**
Crear archivo `src/styles/custom.css`:
```css
:root {
  --color-primary: #ec4899;
  --color-primary-hover: #db2777;
  --color-background: #fdf2f8;
}

.bg-primary {
  background-color: var(--color-primary);
}
```

## 📂 **Archivos que Contienen Colores**

### **Componentes Principales:**
1. `src/components/Navbar.tsx` - Navegación
2. `src/pages/Home.tsx` - Página principal
3. `src/pages/Products.tsx` - Catálogo
4. `src/pages/Contact.tsx` - Contacto
5. `src/pages/Cart.tsx` - Carrito
6. `src/pages/Admin.tsx` - Panel admin
7. `src/pages/Login.tsx` - Login

### **Clases Más Usadas:**
- `bg-pink-500` - Botones principales
- `hover:bg-pink-600` - Hover de botones
- `text-pink-500` - Enlaces y precios
- `focus:ring-pink-500` - Focus de inputs
- `border-pink-500` - Bordes activos

## 🎯 **Cambio Rápido de Tema**

Para cambiar rápidamente de rosa a otro color, busca y reemplaza:
- `pink-50` → `tu-color-50`
- `pink-100` → `tu-color-100`
- `pink-400` → `tu-color-400`
- `pink-500` → `tu-color-500`
- `pink-600` → `tu-color-600`

## 🌈 **Paletas Sugeridas**

### **Elegante Azul:**
- `blue-50`, `blue-100`, `blue-500`, `blue-600`

### **Sofisticado Púrpura:**
- `purple-50`, `purple-100`, `purple-500`, `purple-600`

### **Natural Verde:**
- `emerald-50`, `emerald-100`, `emerald-500`, `emerald-600`

### **Cálido Naranja:**
- `orange-50`, `orange-100`, `orange-500`, `orange-600`