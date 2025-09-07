# PokémonApp 🎮

Una aplicación móvil desarrollada con React Native que utiliza la **PokéAPI v2** para mostrar información detallada de Pokémon.

## ✨ Características

- 📱 **Lista paginada** de Pokémon con scroll infinito
- 🔍 **Búsqueda inteligente** de Pokémon (por nombre, ID o nombre parcial)
- 📊 **Detalles completos** de cada Pokémon:
  - Estadísticas base con barras visuales
  - Tipos y colores dinámicos
  - Habilidades (normales y ocultas)
  - Información física (altura, peso)
  - Descripción de la especie en español
- 🎨 **UI moderna** con colores basados en tipos de Pokémon
- ⚡ **Cache local inteligente** para mejorar rendimiento
- 🔄 **Pull to refresh** y manejo robusto de errores
- 📲 **Navegación fluida** entre pantallas
- ⌨️ **Búsqueda con debounce** para mejor experiencia

## 🔍 Características de Búsqueda Mejoradas

La búsqueda de Pokémon ahora incluye:
- **Búsqueda por nombre completo**: "pikachu", "charizard"
- **Búsqueda por ID**: "25", "1", "150"
- **Búsqueda parcial**: "pika" encontrará Pikachu
- **Debounce automático** de 500ms para evitar llamadas excesivas
- **Lista de sugerencias** con los primeros 151 Pokémon más populares
- **Manejo de errores** con mensajes informativos

## 🛠️ Tecnologías Utilizadas

- **React Native 0.81.1**
- **TypeScript** para tipado estático estricto
- **PokéAPI v2** como fuente de datos
- **React Hooks** personalizados para manejo de estado
- **Fetch API** con sistema de cache inteligente
- **Debounce** para optimización de búsquedas

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── PokemonCard.tsx  # Tarjeta de Pokémon con tipos coloridos
│   └── LoadingState.tsx # Estados de carga y error
├── hooks/              # Custom hooks para lógica de negocio
│   └── usePokemon.ts   # Hooks para gestión de datos y búsqueda
├── screens/            # Pantallas principales
│   ├── PokemonListScreen.tsx    # Lista con búsqueda
│   └── PokemonDetailScreen.tsx  # Detalles completos
├── services/           # Servicios y APIs
│   └── pokemonAPI.ts   # Cliente optimizado de PokéAPI v2
├── types/              # Definiciones completas de TypeScript
│   └── pokemon.ts      # Tipos de datos de la PokéAPI
├── utils/              # Utilidades y helpers
│   └── formatters.ts   # Funciones de formateo y colores
└── index.ts            # Exportaciones centralizadas
```

## 🚀 Características de la PokéAPI v2

### Endpoints Utilizados

- `GET /pokemon?limit=20&offset=0` - Lista paginada con 20 elementos
- `GET /pokemon/{id or name}` - Detalles específicos de Pokémon
- `GET /pokemon-species/{id}` - Información de especie y descripción
- `GET /evolution-chain/{id}` - Cadena de evolución (preparado para futuras mejoras)

### Sistema de Cache Inteligente

La aplicación implementa un cache avanzado que:
- ✅ **Almacena por 5 minutos** cada respuesta de la API
- ✅ **Evita llamadas duplicadas** a los mismos endpoints
- ✅ **Mejora la velocidad** de navegación significativamente
- ✅ **Respeta las políticas** de uso justo de PokéAPI
- ✅ **Gestión automática** de memoria con limpieza de cache

### Búsqueda Optimizada

- **Debounce de 500ms** para evitar spam de peticiones
- **Cache de resultados** de búsqueda
- **Fallback a lista popular** cuando no se encuentra el Pokémon
- **Búsqueda flexible** que acepta nombres parciales e IDs

## 🎨 Diseño y UX

### Colores Dinámicos por Tipo

Cada Pokémon muestra colores temáticos basados en su tipo primario:
- 🔥 **Fuego**: #F08030 (naranja intenso)
- 💧 **Agua**: #6890F0 (azul océano)
- 🌱 **Planta**: #78C850 (verde hierba)
- ⚡ **Eléctrico**: #F8D030 (amarillo brillante)
- 🔮 **Psíquico**: #F85888 (rosa mystical)
- 🪨 **Roca**: #B8A038 (marrón tierra)
- 👻 **Fantasma**: #705898 (púrpura misterioso)
- 🐲 **Dragón**: #7038F8 (azul místico)
- Y muchos más...

### Componentes Responsivos

- **Grid flexible** de 2 columnas que se adapta al tamaño
- **Imágenes optimizadas** con placeholders elegantes
- **Barras de estadísticas** con colores según valor
- **Chips de tipos** con esquemas de color coherentes
- **Feedback visual** en todas las interacciones

## 📊 Información Mostrada

### Lista Principal
- **Imagen oficial** del Pokémon desde PokeAPI
- **Nombre capitalizado** y número de Pokédex formateado
- **Tipos primarios** con colores distintivos
- **Efecto hover** y animaciones suaves

### Pantalla de Detalles
- **Información básica**: Altura (m), peso (kg), experiencia base
- **Estadísticas completas**: 
  - PS (Hit Points)
  - Ataque y Defensa
  - Ataque Especial y Defensa Especial
  - Velocidad
  - Barras visuales con colores según rendimiento
- **Habilidades**: Normales y ocultas claramente marcadas
- **Descripción**: Texto de la especie en español cuando está disponible
- **Tipos**: Múltiples tipos con diseño consistente

## 🔧 Instalación y Configuración

### Prerequisitos
- Node.js 20 o superior
- React Native CLI
- Xcode (para iOS) / Android Studio (para Android)
- Watchman para file watching

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

2. **Configurar iOS (solo primera vez)**
   ```bash
   cd ios && bundle install && bundle exec pod install && cd ..
   ```

3. **Iniciar Metro server**
   ```bash
   npx react-native start --reset-cache
   ```

4. **Ejecutar en iOS** (nueva terminal)
   ```bash
   npx react-native run-ios
   ```

5. **Ejecutar en Android** (nueva terminal)
   ```bash
   npx react-native run-android
   ```

### Solución de Problemas Comunes

**Error de Watchman**: Si ves errores de "too many open files":
```bash
watchman shutdown-server
npx react-native start --reset-cache
```

**Cache corrupto**:
```bash
npx react-native start --reset-cache
```

## 🌐 Respeto por la API y Fair Use

Esta aplicación cumple estrictamente con la **Fair Use Policy** de PokéAPI:
- ✅ **Cache local obligatorio** de todas las respuestas
- ✅ **Límites de paginación** razonables (20 elementos por página)
- ✅ **Debounce en búsquedas** para evitar spam
- ✅ **Manejo responsable** de errores y reintentos
- ✅ **No sobrecarga** del servidor público gratuito

## 🚀 Roadmap y Futuras Mejoras

### Próximas Funcionalidades
- [ ] **Filtrado avanzado** por tipos, generaciones y regiones
- [ ] **Sistema de favoritos** con almacenamiento local
- [ ] **Modo offline** completo con base de datos local
- [ ] **Animaciones fluidas** entre transiciones
- [ ] **Comparador** de estadísticas entre Pokémon
- [ ] **Cadena de evoluciones** visual interactiva
- [ ] **Sonidos oficiales** de Pokémon
- [ ] **Tema oscuro** con persistencia de preferencias

### Mejoras Técnicas
- [ ] **Infinite scroll** más eficiente con virtualización
- [ ] **Pre-loading** inteligente de imágenes
- [ ] **Compresión** de cache para optimizar memoria
- [ ] **Tests unitarios** completos
- [ ] **CI/CD** pipeline
- [ ] **Analytics** de uso (anónimo)

## 📱 Capturas de Pantalla

*(Agregar capturas cuando la app esté funcionando)*

## 📝 Notas Técnicas

### Migración de PokéAPI v1 → v2

Esta implementación utiliza **PokéAPI v2** que ofrece:
- ✅ **Estructura de datos mejorada** y más consistente
- ✅ **Mayor información disponible** por endpoint
- ✅ **Endpoints más estables** y mejor documentados
- ✅ **Mejor soporte** para múltiples idiomas
- ✅ **URLs más predictibles** y RESTful

### Arquitectura TypeScript

El proyecto mantiene tipado estricto con:
- ✅ **Interfaces completas** para todas las respuestas de API
- ✅ **Tipos personalizados** para uso en UI
- ✅ **Generics** para reutilización de código
- ✅ **Utility types** para transformaciones
- ✅ **Strict mode** habilitado para máxima seguridad

### Performance y Optimización

- **Memoización** de componentes pesados
- **useMemo/useCallback** para evitar re-renders
- **Cache inteligente** con TTL personalizable
- **Lazy loading** de imágenes
- **Debounce** en todas las búsquedas
- **Error boundaries** para recuperación elegante

## 🤝 Contribuciones

¡Las contribuciones son muy bienvenidas! Para contribuir:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request** con descripción detallada

### Guidelines de Contribución
- Mantener el tipado estricto de TypeScript
- Agregar tests para nuevas funcionalidades
- Seguir las convenciones de naming existentes
- Documentar cambios en la API

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** - ver el archivo `LICENSE` para detalles.

## 🙏 Agradecimientos

- **PokéAPI Team** por mantener esta increíble API gratuita
- **React Native Community** por las herramientas y librerías
- **Pokémon Company** por crear estos personajes icónicos
- **Nintendo/Game Freak** por los videojuegos originales

---

**Desarrollado con ❤️ usando React Native y PokéAPI v2**

*"Gotta catch 'em all!" - Ash Ketchum*

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
