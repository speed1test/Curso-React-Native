import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BasicTypes } from './typescript'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <h1>Introducción a React</h1>
        <p>
          React es una biblioteca de JavaScript para construir interfaces de usuario.
        </p>
        <BasicTypes />
      </main>
    </>
  )
}

export default App
