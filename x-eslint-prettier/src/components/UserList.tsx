import React, { useState, useEffect } from 'react'
import { FC } from 'react'

// Ejemplo con varios problemas de formato y eslint
interface User {
  id: number
  name: string
  email?: string
}

const UserCard: FC<{ user: User; onEdit: (id: number) => void }> = ({
  user,
  onEdit,
}) => {
  console.log('Rendering user card') // ESLint warning: no-console

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}>
      <h3>{user.name}</h3>
      {user.email && <p>Email: {user.email}</p>}
      <button onClick={() => onEdit(user.id)}>Edit User</button>
    </div>
  )
}

export const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const unusedVariable = 'esto causará warning' // ESLint warning: unused variable

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
        { id: 2, name: 'María García' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com' },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleEditUser = (id: number) => {
    console.log(`Editing user with id: ${id}`) // ESLint warning: no-console
    // Lógica de edición aquí
  }

  if (loading) {
    return <div>Cargando usuarios...</div>
  }

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {users.length === 0 ? (
        <p>No hay usuarios disponibles</p>
      ) : (
        users.map(user => (
          <UserCard key={user.id} user={user} onEdit={handleEditUser} />
        ))
      )}
    </div>
  )
}

export default UserList
