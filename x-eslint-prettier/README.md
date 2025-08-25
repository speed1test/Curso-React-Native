# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# ESLint + Prettier Example

Este proyecto demuestra la configuración e integración de **ESLint** y **Prettier** en un proyecto de React + TypeScript + Vite.

## 🚀 Características

- ✅ **ESLint 9** con configuración flat config
- ✅ **Prettier** para formateo automático de código
- ✅ **Integración ESLint + Prettier** sin conflictos
- ✅ **React + TypeScript** con reglas específicas
- ✅ **Scripts automatizados** para linting y formateo
- ✅ **Configuración de VS Code** incluida

## 📦 Instalación

```bash
npm install
```

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia el servidor de desarrollo
```

### Linting y Formateo
```bash
npm run lint         # Ejecuta ESLint para revisar el código
npm run lint:fix     # Ejecuta ESLint y corrige automáticamente los errores
npm run format       # Formatea el código con Prettier
npm run format:check # Verifica si el código está bien formateado
npm run check        # Ejecuta tanto lint como format:check
```

### Build
```bash
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción
```

## ⚙️ Configuración

### ESLint (`eslint.config.js`)
- Configuración con **flat config** (ESLint 9+)
- Reglas para **React**, **TypeScript**, y **React Hooks**
- Integración con **Prettier**
- Reglas personalizadas para mejor calidad de código

### Prettier (`.prettierrc`)
- Configuración consistente de formateo
- Sin punto y coma
- Comillas simples
- Trailing commas
- 80 caracteres por línea

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── UserList.tsx     # Componente de ejemplo con tipos
├── examples/
│   └── ESLintExamples.tsx # Ejemplos de reglas de ESLint
├── App.tsx              # Componente principal
└── main.tsx            # Punto de entrada
```

## 🔧 Configuración de VS Code

Para la mejor experiencia, instala estas extensiones:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)

### Configuración recomendada (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## 📋 Ejemplos de Reglas

### ESLint detecta:
- ❌ Variables no utilizadas
- ❌ Imports no utilizados  
- ❌ Uso de `console.log` en producción
- ❌ Uso de `any` en TypeScript
- ❌ Uso de `var` en lugar de `const`/`let`

### Prettier formatea:
- ✅ Indentación consistente
- ✅ Espaciado de objetos y arrays
- ✅ Longitud de línea
- ✅ Comillas y punto y coma
- ✅ Trailing commas

## 🎯 Flujo de Trabajo Recomendado

1. **Desarrollo**: Escribe código libremente
2. **Guardado**: Prettier formatea automáticamente (si tienes VS Code configurado)
3. **Pre-commit**: Ejecuta `npm run check` para validar todo
4. **CI/CD**: Incluye `npm run check` en tu pipeline

## 📝 Notas

- Los archivos en `src/examples/` contienen **errores intencionalmente** para demostrar las reglas de ESLint
- Usa `npm run lint:fix` para corregir automáticamente los errores que se puedan arreglar
- Algunos errores requerirán corrección manual

## 🚀 Siguiente Nivel

Para proyectos más avanzados, considera agregar:
- **Husky** para git hooks
- **lint-staged** para linting de archivos modificados
- **Commitlint** para mensajes de commit consistentes
- **Testing** con Jest/Vitest

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
