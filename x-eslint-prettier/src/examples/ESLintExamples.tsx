// Este archivo contiene ejemplos de diferentes reglas de ESLint y Prettier

import React from 'react'

// ❌ Problema: import no utilizado
import { Component } from 'react'

// ❌ Problema: variable no utilizada
const unusedVariable = 'Esta variable no se usa'

// ❌ Problema: uso de var en lugar de const/let
const oldStyleVariable = 'Debería usar const o let'

// ❌ Problema: console.log en producción
console.log('Este console.log causará un warning')

// ❌ Problema: función que no devuelve nada explícitamente
function problematicFunction(value: any) {
  // ❌ Problema: uso de 'any'
  console.log(value)
}

// ✅ Versión corregida
const goodFunction = (value: string): void => {
  // En desarrollo podrías usar console.log, pero ESLint te avisará
  if (process.env.NODE_ENV === 'development') {
    console.log(value)
  }
}

// ❌ Problemas de formato que Prettier corregirá automáticamente
const badlyFormattedObject = {
  name: 'Juan',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
}

// ❌ Problema: función de componente mal formateada
const BadComponent = () => {
  return (
    <div>
      <h1>Mal formateado</h1>
      <p>Prettier arreglará esto</p>
    </div>
  )
}

// ✅ Componente bien formateado
interface GoodComponentProps {
  name: string
  age?: number
}

const GoodComponent: React.FC<GoodComponentProps> = ({ name, age }) => {
  return (
    <div>
      <h1>Hola {name}</h1>
      {age && <p>Tienes {age} años</p>}
    </div>
  )
}

// ❌ Problema: array mal formateado
const badArray = [
  'item1',
  'item2',
  'item3',
  'item4',
  'item5',
  'item6',
  'item7',
  'item8',
]

// ✅ Array bien formateado (Prettier lo hará automáticamente)
const goodArray = [
  'item1',
  'item2',
  'item3',
  'item4',
  'item5',
  'item6',
  'item7',
  'item8',
]

// ❌ Problema: objeto con propiedades mal alineadas
const badObject = {
  name: 'Juan',
  email: 'juan@example.com',
  age: 30,
  city: 'Madrid',
}

// ✅ Objeto bien formateado
const goodObject = {
  name: 'Juan',
  email: 'juan@example.com',
  age: 30,
  city: 'Madrid',
}

export default GoodComponent
