import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UserList from './components/UserList'
import ImprovedUserList from './components/ImprovedUserList'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showUsers, setShowUsers] = useState(false)
  const [useImproved, setUseImproved] = useState(false)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ESLint + Prettier Example</h1>

      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={() => setShowUsers(!showUsers)}
          style={{ marginLeft: '10px' }}
        >
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
        {showUsers && (
          <button
            onClick={() => setUseImproved(!useImproved)}
            style={{ marginLeft: '10px' }}
          >
            {useImproved ? 'Basic Version' : 'Improved Version'}
          </button>
        )}

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {showUsers && (useImproved ? <ImprovedUserList /> : <UserList />)}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
export default App
