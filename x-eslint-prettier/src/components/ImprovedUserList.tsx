// ✅ EJEMPLOS CORREGIDOS - Esta versión muestra las mejores prácticas

import React from 'react'
import './UserComponents.css'

// ✅ Tipos bien definidos
interface User {
  id: number
  name: string
  email?: string
  isActive: boolean
}

interface UserFormData {
  name: string
  email: string
  isActive: boolean
}

interface UserCardProps {
  user: User
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

interface UserModalProps {
  isOpen: boolean
  user?: User | null
  onClose: () => void
  onSave: (userData: UserFormData, userId?: number) => void
}

// ✅ Componente Modal para agregar/editar usuarios
const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<UserFormData>({
    name: '',
    email: '',
    isActive: true,
  })

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email || '',
        isActive: user.isActive,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        isActive: true,
      })
    }
  }, [user, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSave(formData, user?.id)
      onClose()
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingresa el nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="isActive">Estado</label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive.toString()}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  isActive: e.target.value === 'true',
                }))
              }
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ✅ Componente funcional con TypeScript apropiado
const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // ✅ Usando console.log solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Rendering user card for:', user.name)
  }

  return (
    <div className="user-card">
      <div className="user-info">
        <h3>{user.name}</h3>
        {user.email && <p>Email: {user.email}</p>}
        <p>Estado: {user.isActive ? 'Activo' : 'Inactivo'}</p>
      </div>
      <div className="user-actions">
        <button
          onClick={() => onEdit(user.id)}
          className="btn btn-primary"
          type="button"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="btn btn-danger"
          type="button"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

// ✅ Hook personalizado mejorado
const useUsers = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // Simulando una llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockUsers: User[] = [
          {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan@example.com',
            isActive: true,
          },
          { id: 2, name: 'María García', isActive: false },
          {
            id: 3,
            name: 'Carlos López',
            email: 'carlos@example.com',
            isActive: true,
          },
        ]

        setUsers(mockUsers)
        setError(null)
      } catch (err) {
        setError('Error al cargar usuarios')
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error fetching users:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const addUser = React.useCallback((userData: UserFormData) => {
    const newUser: User = {
      id: Date.now(), // En una app real, esto vendría del backend
      name: userData.name,
      email: userData.email || undefined,
      isActive: userData.isActive,
    }
    setUsers(prev => [...prev, newUser])
  }, [])

  const updateUser = React.useCallback(
    (userId: number, userData: UserFormData) => {
      setUsers(prev =>
        prev.map(user =>
          user.id === userId
            ? {
                ...user,
                name: userData.name,
                email: userData.email || undefined,
                isActive: userData.isActive,
              }
            : user
        )
      )
    },
    []
  )

  const deleteUser = React.useCallback((userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }, [])

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
  }
}

// ✅ Componente principal mejorado
export const ImprovedUserList: React.FC = () => {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)

  const handleEditUser = React.useCallback(
    (id: number) => {
      const user = users.find(u => u.id === id)
      if (user) {
        setEditingUser(user)
        setIsModalOpen(true)
      }
    },
    [users]
  )

  const handleDeleteUser = React.useCallback(
    (id: number) => {
      if (
        window.confirm('¿Estás seguro de que quieres eliminar este usuario?')
      ) {
        deleteUser(id)
      }
    },
    [deleteUser]
  )

  const handleSaveUser = React.useCallback(
    (userData: UserFormData, userId?: number) => {
      if (userId) {
        updateUser(userId, userData)
      } else {
        addUser(userData)
      }
    },
    [addUser, updateUser]
  )

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false)
    setEditingUser(null)
  }, [])

  const handleAddUser = React.useCallback(() => {
    setEditingUser(null)
    setIsModalOpen(true)
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  return (
    <div className="user-list-container">
      <header>
        <div className="header-content">
          <div>
            <h2>Lista de Usuarios Mejorada</h2>
            <p>Total: {users.length} usuarios</p>
          </div>
          <button
            onClick={handleAddUser}
            className="btn btn-primary add-user-btn"
          >
            + Agregar Usuario
          </button>
        </div>
      </header>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No hay usuarios disponibles</p>
          <button onClick={handleAddUser} className="btn btn-primary">
            Agregar primer usuario
          </button>
        </div>
      ) : (
        <div className="users-grid">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        user={editingUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  )
}

export default ImprovedUserList
