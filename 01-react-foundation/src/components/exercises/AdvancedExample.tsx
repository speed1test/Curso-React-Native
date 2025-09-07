import { useState } from 'react';
import './AdvancedExample.css';
import { useCounter } from '../../hooks/useCounter';
import { useApi } from '../../hooks/useApi';
import type { Post } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import { useAuthStore } from '../../stores/authStore';

// Interfaces and literal objects
interface ContactForm {
  name: string;
  email: string;
  message: string;
  category: string;
  subscribe: boolean;
}

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: 'es' | 'en';
  };
}

// Literal object examples
const defaultPreferences = {
  theme: 'dark' as const,
  notifications: true,
  language: 'es' as const,
};

const categories = [
  { id: 1, name: 'General', color: '#4ecdc4' },
  { id: 2, name: 'Soporte', color: '#45a3e5' },
  { id: 3, name: 'Ventas', color: '#66bb6a' },
  { id: 4, name: 'Feedback', color: '#ff7043' },
];

export const AdvancedExample = () => {
  // useState hooks
  const [selectedTab, setSelectedTab] = useState<string>('counter');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    age: 25,
    preferences: defaultPreferences,
  });

  // Custom hooks
  const { count, increment, decrement, reset, setValue } = useCounter(0, 1);
  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = useApi<Post>('https://jsonplaceholder.typicode.com/posts', 1, 5);

  // Zustand store for authentication
  const { user, isAuthenticated, isLoading, error, login, logout } =
    useAuthStore();

  // Form handling with validation
  const {
    values: formValues,
    errors: formErrors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset: resetForm,
  } = useForm<ContactForm>(
    {
      name: '',
      email: '',
      message: '',
      category: '',
      subscribe: false,
    },
    {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 500,
      },
      category: {
        required: true,
      },
    }
  );

  // Login form
  const {
    values: loginValues,
    errors: loginErrors,
    handleChange: handleLoginChange,
    handleSubmit: handleLoginSubmit,
  } = useForm(
    {
      email: '',
      password: '',
    },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
      },
    }
  );

  // Functions with arguments and return values
  const calculateAge = (birthYear: number): number => {
    return new Date().getFullYear() - birthYear;
  };

  const formatUserName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim();
  };

  const updateUserPreferences = (
    newPreferences: Partial<UserProfile['preferences']>
  ): void => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...newPreferences,
      },
    }));
  };

  const generatePageNumbers = (): number[] => {
    const pages: number[] = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  // Form submission handlers
  const onContactSubmit = async (values: ContactForm): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Contact form submitted:', values);
    alert('¡Formulario enviado exitosamente!');
    resetForm();
  };

  const onLoginSubmit = async (values: {
    email: string;
    password: string;
  }): Promise<void> => {
    await login(values.email, values.password);
  };

  // Render functions
  const renderAuthSection = () => {
    if (isAuthenticated && user) {
      return (
        <div className="auth-section authenticated">
          <h3>Bienvenido, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <p>Rol: {user.role}</p>
          <button onClick={logout} className="btn btn-danger">
            Cerrar Sesión
          </button>
        </div>
      );
    }

    return (
      <div className="auth-section">
        <h3>Iniciar Sesión</h3>
        <form
          onSubmit={handleLoginSubmit(onLoginSubmit)}
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="loginEmail">Email:</label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={loginValues.email}
              onChange={handleLoginChange}
              className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`}
            />
            {loginErrors.email && (
              <div className="invalid-feedback">{loginErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Contraseña:</label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              value={loginValues.password}
              onChange={handleLoginChange}
              className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`}
            />
            {loginErrors.password && (
              <div className="invalid-feedback">{loginErrors.password}</div>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>Credenciales de prueba:</h4>
          <p>Admin: admin@test.com / admin123</p>
          <p>Usuario: user@test.com / user123</p>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    const pages = generatePageNumbers();

    return (
      <div className="pagination-container">
        <button
          onClick={prevPage}
          disabled={pagination.page === 1}
          className="btn btn-outline-primary"
        >
          Anterior
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`btn ${pagination.page === page ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={pagination.page === pagination.totalPages}
          className="btn btn-outline-primary"
        >
          Siguiente
        </button>

        <span className="pagination-info">
          Página {pagination.page} de {pagination.totalPages} (Total:{' '}
          {pagination.total})
        </span>
      </div>
    );
  };

  return (
    <div className="advanced-example-container">
      <h2>Ejemplo Avanzado - React con TypeScript</h2>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          onClick={() => setSelectedTab('counter')}
          className={`tab-button ${selectedTab === 'counter' ? 'active' : ''}`}
        >
          Custom Hook (Counter)
        </button>
        <button
          onClick={() => setSelectedTab('api')}
          className={`tab-button ${selectedTab === 'api' ? 'active' : ''}`}
        >
          HTTP & Paginación
        </button>
        <button
          onClick={() => setSelectedTab('forms')}
          className={`tab-button ${selectedTab === 'forms' ? 'active' : ''}`}
        >
          Formularios
        </button>
        <button
          onClick={() => setSelectedTab('auth')}
          className={`tab-button ${selectedTab === 'auth' ? 'active' : ''}`}
        >
          Auth (Zustand)
        </button>
        <button
          onClick={() => setSelectedTab('objects')}
          className={`tab-button ${selectedTab === 'objects' ? 'active' : ''}`}
        >
          Interfaces & Objetos
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === 'counter' && (
          <div className="counter-section">
            <h3>Custom Hook - useCounter</h3>
            <div className="counter-display">
              <h4>Contador: {count}</h4>
              <div className="counter-controls">
                <button onClick={decrement} className="btn btn-danger">
                  -1
                </button>
                <button onClick={increment} className="btn btn-success">
                  +1
                </button>
                <button onClick={reset} className="btn btn-warning">
                  Reset
                </button>
                <button onClick={() => setValue(100)} className="btn btn-info">
                  Set 100
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'api' && (
          <div className="api-section">
            <h3>Peticiones HTTP con Paginación</h3>
            <div className="api-controls">
              <button onClick={refresh} className="btn btn-primary">
                Refrescar
              </button>
            </div>

            {postsLoading && <div className="loading">Cargando posts...</div>}
            {postsError && (
              <div className="alert alert-danger">{postsError}</div>
            )}

            <div className="posts-container">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <h4>Post #{post.id}</h4>
                  <h5>{post.title}</h5>
                  <p>{post.body}</p>
                  <small>Usuario ID: {post.userId}</small>
                </div>
              ))}
            </div>

            {renderPagination()}
          </div>
        )}

        {selectedTab === 'forms' && (
          <div className="forms-section">
            <h3>Formulario con Validación</h3>
            <form
              onSubmit={handleSubmit(onContactSubmit)}
              className="contact-form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback">{formErrors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría:</label>
                <select
                  id="category"
                  name="category"
                  value={formValues.category}
                  onChange={handleChange}
                  className={`form-control ${formErrors.category ? 'is-invalid' : ''}`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <div className="invalid-feedback">{formErrors.category}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  rows={4}
                  className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                />
                {formErrors.message && (
                  <div className="invalid-feedback">{formErrors.message}</div>
                )}
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="subscribe"
                  name="subscribe"
                  checked={formValues.subscribe}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="subscribe" className="form-check-label">
                  Suscribirse al newsletter
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedTab === 'auth' && renderAuthSection()}

        {selectedTab === 'objects' && (
          <div className="objects-section">
            <h3>Interfaces y Objetos Literales</h3>

            <div className="user-profile">
              <h4>Perfil de Usuario</h4>
              <p>
                <strong>Nombre:</strong>{' '}
                {formatUserName(userProfile.firstName, userProfile.lastName)}
              </p>
              <p>
                <strong>Edad:</strong> {userProfile.age} años
              </p>
              <p>
                <strong>Edad calculada:</strong>{' '}
                {calculateAge(new Date().getFullYear() - userProfile.age)} años
              </p>

              <div className="preferences">
                <h5>Preferencias:</h5>
                <div className="preference-item">
                  <label>
                    Tema:
                    <select
                      value={userProfile.preferences.theme}
                      onChange={e =>
                        updateUserPreferences({
                          theme: e.target.value as 'light' | 'dark',
                        })
                      }
                      className="form-control"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                    </select>
                  </label>
                </div>

                <div className="preference-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={userProfile.preferences.notifications}
                      onChange={e =>
                        updateUserPreferences({
                          notifications: e.target.checked,
                        })
                      }
                    />
                    Notificaciones
                  </label>
                </div>

                <div className="preference-item">
                  <label>
                    Idioma:
                    <select
                      value={userProfile.preferences.language}
                      onChange={e =>
                        updateUserPreferences({
                          language: e.target.value as 'es' | 'en',
                        })
                      }
                      className="form-control"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="categories-display">
              <h4>Categorías (Objetos Literales)</h4>
              <div className="categories-grid">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="category-card"
                    style={{ borderColor: category.color }}
                  >
                    <div
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
