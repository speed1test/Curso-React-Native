import { useState, useEffect } from 'react';
import initSqlJs, { Database as SqlDatabase } from 'sql.js';
import './Database.css';

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  course: string;
  grade: number;
}

export const Database = () => {
  const [db, setDb] = useState<SqlDatabase | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: '',
    grade: '',
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'grade'>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Save database to localStorage
  const saveDatabase = (database: SqlDatabase = db!) => {
    if (!database) return;

    try {
      setIsSaving(true);
      const data = database.export();
      const base64String = btoa(String.fromCharCode(...new Uint8Array(data)));
      localStorage.setItem('sqlite_database', base64String);
      console.log('Base de datos guardada en localStorage');
      setTimeout(() => setIsSaving(false), 500); // Show saving indicator briefly
    } catch (err) {
      console.error('Error al guardar base de datos:', err);
      setError('Error al guardar base de datos: ' + (err as Error).message);
      setIsSaving(false);
    }
  };

  // Initialize SQLite database
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });

        let database: SqlDatabase;

        // Try to load existing database from localStorage
        const savedDB = localStorage.getItem('sqlite_database');
        if (savedDB) {
          try {
            const dbData = Uint8Array.from(atob(savedDB), c => c.charCodeAt(0));
            database = new SQL.Database(dbData);
            console.log('Base de datos cargada desde localStorage');
          } catch (err) {
            console.log(
              'Error al cargar base de datos guardada, creando nueva:',
              err
            );
            database = new SQL.Database();
          }
        } else {
          database = new SQL.Database();
        }

        // Create students table if it doesn't exist
        database.run(`
          CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER NOT NULL,
            course TEXT NOT NULL,
            grade REAL NOT NULL
          )
        `);

        // Check if table is empty and insert sample data only if needed
        const countStmt = database.prepare(
          'SELECT COUNT(*) as count FROM students'
        );
        countStmt.step();
        const count = countStmt.getAsObject().count as number;
        countStmt.free();

        if (count === 0) {
          // Insert sample data only if table is empty
          const sampleData = [
            ['Juan Pérez', 'juan@email.com', 20, 'React', 85.5],
            ['María García', 'maria@email.com', 22, 'TypeScript', 92.0],
            ['Carlos López', 'carlos@email.com', 19, 'JavaScript', 78.5],
            ['Ana Martínez', 'ana@email.com', 21, 'React', 88.0],
            ['Luis Rodríguez', 'luis@email.com', 23, 'Node.js', 90.5],
          ];

          sampleData.forEach(([name, email, age, course, grade]) => {
            try {
              database.run(
                'INSERT INTO students (name, email, age, course, grade) VALUES (?, ?, ?, ?, ?)',
                [name, email, age, course, grade]
              );
            } catch (err) {
              console.log('Error insertando datos de ejemplo:', err);
            }
          });

          // Save to localStorage after inserting sample data
          saveDatabase(database);
        }

        setDb(database);
        loadStudents(database);
        setIsLoading(false);
      } catch (err) {
        setError(
          'Error al inicializar la base de datos: ' + (err as Error).message
        );
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const loadStudents = (database: SqlDatabase = db!) => {
    if (!database) return;

    try {
      let query = 'SELECT * FROM students WHERE 1=1';
      const params: any[] = [];

      if (searchTerm) {
        query += ' AND (name LIKE ? OR email LIKE ?)';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      if (selectedCourse) {
        query += ' AND course = ?';
        params.push(selectedCourse);
      }

      query += ` ORDER BY ${sortBy} ${sortOrder}`;

      console.log('Ejecutando consulta:', query, 'con parámetros:', params);

      const stmt = database.prepare(query);
      const result = [];

      if (params.length > 0) {
        stmt.bind(params);
      }

      while (stmt.step()) {
        const row = stmt.getAsObject();
        result.push({
          id: row.id as number,
          name: row.name as string,
          email: row.email as string,
          age: row.age as number,
          course: row.course as string,
          grade: row.grade as number,
        });
      }

      stmt.free();
      console.log('Estudiantes cargados:', result.length);
      setStudents(result);
    } catch (err) {
      console.error('Error en loadStudents:', err);
      setError('Error al cargar estudiantes: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    if (db) {
      loadStudents();
    }
  }, [searchTerm, selectedCourse, sortBy, sortOrder, db]);

  const addStudent = () => {
    if (!db) {
      setError('Base de datos no disponible');
      return;
    }

    try {
      const { name, email, age, course, grade } = formData;

      if (!name || !email || !age || !course || !grade) {
        setError('Todos los campos son obligatorios');
        return;
      }

      // Validaciones adicionales
      if (parseInt(age) < 16 || parseInt(age) > 100) {
        setError('La edad debe estar entre 16 y 100 años');
        return;
      }

      if (parseFloat(grade) < 0 || parseFloat(grade) > 100) {
        setError('La calificación debe estar entre 0 y 100');
        return;
      }

      console.log('Agregando estudiante:', {
        name,
        email,
        age: parseInt(age),
        course,
        grade: parseFloat(grade),
      });

      const result = db.run(
        'INSERT INTO students (name, email, age, course, grade) VALUES (?, ?, ?, ?, ?)',
        [name, email, parseInt(age), course, parseFloat(grade)]
      );

      console.log('Resultado de inserción:', result);

      // Save database to localStorage
      saveDatabase();

      setFormData({ name: '', email: '', age: '', course: '', grade: '' });
      setError('');
      setSuccessMessage(`Estudiante ${name} agregado exitosamente`);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);

      loadStudents();
    } catch (err) {
      console.error('Error al agregar estudiante:', err);
      setError('Error al agregar estudiante: ' + (err as Error).message);
    }
  };

  const updateStudent = (
    id: number,
    field: keyof Omit<Student, 'id'>,
    value: string | number
  ) => {
    if (!db) return;

    try {
      db.run(`UPDATE students SET ${field} = ? WHERE id = ?`, [value, id]);
      saveDatabase(); // Save to localStorage
      loadStudents();
    } catch (err) {
      setError('Error al actualizar estudiante: ' + (err as Error).message);
    }
  };

  const deleteStudent = (id: number) => {
    if (!db) return;

    try {
      db.run('DELETE FROM students WHERE id = ?', [id]);
      saveDatabase(); // Save to localStorage
      loadStudents();
    } catch (err) {
      setError('Error al eliminar estudiante: ' + (err as Error).message);
    }
  };

  const getStatistics = () => {
    if (!db) return null;

    try {
      const countStmt = db.prepare('SELECT COUNT(*) as count FROM students');
      countStmt.step();
      const totalStudents = countStmt.getAsObject().count as number;
      countStmt.free();

      const avgStmt = db.prepare('SELECT AVG(grade) as avg FROM students');
      avgStmt.step();
      const averageGrade = parseFloat(
        (avgStmt.getAsObject().avg as number).toFixed(2)
      );
      avgStmt.free();

      const courseStmt = db.prepare(
        'SELECT course, COUNT(*) as count FROM students GROUP BY course'
      );
      const courseStats = [];
      while (courseStmt.step()) {
        const row = courseStmt.getAsObject();
        courseStats.push({
          course: row.course as string,
          count: row.count as number,
        });
      }
      courseStmt.free();

      return { totalStudents, averageGrade, courseStats };
    } catch (err) {
      setError('Error al obtener estadísticas: ' + (err as Error).message);
      return null;
    }
  };

  const exportDatabase = () => {
    if (!db) return;

    const data = db.export();
    const blob = new Blob([new Uint8Array(data)], {
      type: 'application/octet-stream',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_database.sqlite';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearDatabase = () => {
    if (!db) return;

    try {
      db.run('DELETE FROM students');
      saveDatabase(); // Save to localStorage
      loadStudents();
    } catch (err) {
      setError('Error al limpiar la base de datos: ' + (err as Error).message);
    }
  };

  const restoreSampleData = () => {
    if (!db) return;

    try {
      // Clear existing data first
      db.run('DELETE FROM students');

      // Insert sample data
      const sampleData = [
        ['Juan Pérez', 'juan@email.com', 20, 'React', 85.5],
        ['María García', 'maria@email.com', 22, 'TypeScript', 92.0],
        ['Carlos López', 'carlos@email.com', 19, 'JavaScript', 78.5],
        ['Ana Martínez', 'ana@email.com', 21, 'React', 88.0],
        ['Luis Rodríguez', 'luis@email.com', 23, 'Node.js', 90.5],
      ];

      sampleData.forEach(([name, email, age, course, grade]) => {
        db.run(
          'INSERT INTO students (name, email, age, course, grade) VALUES (?, ?, ?, ?, ?)',
          [name, email, age, course, grade]
        );
      });

      saveDatabase(); // Save to localStorage
      loadStudents();
      setSuccessMessage('Datos de muestra restaurados exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(
        'Error al restaurar datos de muestra: ' + (err as Error).message
      );
    }
  };

  const statistics = getStatistics();
  const courses = [...new Set(students.map(s => s.course))];

  if (isLoading) {
    return (
      <div className="database-container">
        <div className="loading">
          <h2>Cargando SQLite...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="database-container">
      <h2>Base de Datos SQLite - Gestión de Estudiantes</h2>

      {isSaving && (
        <div className="alert alert-info" role="alert">
          💾 Guardando datos en localStorage...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="statistics-section">
          <h3>Estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Estudiantes</h4>
              <span className="stat-number">{statistics.totalStudents}</span>
            </div>
            <div className="stat-card">
              <h4>Promedio General</h4>
              <span className="stat-number">{statistics.averageGrade}</span>
            </div>
            <div className="stat-card">
              <h4>Cursos por Estudiantes</h4>
              <div className="course-stats">
                {statistics.courseStats.map(({ course, count }) => (
                  <div key={course} className="course-stat">
                    {course}: {count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Form */}
      <div className="form-section">
        <h3>Agregar Nuevo Estudiante</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="form-control"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="form-control"
          />
          <input
            type="number"
            placeholder="Edad"
            value={formData.age}
            onChange={e => setFormData({ ...formData, age: e.target.value })}
            className="form-control"
          />
          <select
            value={formData.course}
            onChange={e => setFormData({ ...formData, course: e.target.value })}
            className="form-control"
          >
            <option value="">Seleccionar Curso</option>
            <option value="React">React</option>
            <option value="TypeScript">TypeScript</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
          </select>
          <input
            type="number"
            step="0.1"
            placeholder="Calificación"
            value={formData.grade}
            onChange={e => setFormData({ ...formData, grade: e.target.value })}
            className="form-control"
          />
          <button onClick={addStudent} className="btn btn-primary">
            Agregar Estudiante
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <h3>Filtros y Búsqueda</h3>
        <div className="filters-grid">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-control"
          />
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="form-control"
          >
            <option value="">Todos los cursos</option>
            {courses.map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e =>
              setSortBy(e.target.value as 'name' | 'age' | 'grade')
            }
            className="form-control"
          >
            <option value="name">Ordenar por Nombre</option>
            <option value="age">Ordenar por Edad</option>
            <option value="grade">Ordenar por Calificación</option>
          </select>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'ASC' | 'DESC')}
            className="form-control"
          >
            <option value="ASC">Ascendente</option>
            <option value="DESC">Descendente</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-section">
        <h3>Lista de Estudiantes ({students.length})</h3>
        <div className="table-responsive">
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Edad</th>
                <th>Curso</th>
                <th>Calificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    <input
                      type="text"
                      value={student.name}
                      onChange={e =>
                        updateStudent(student.id, 'name', e.target.value)
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={student.email}
                      onChange={e =>
                        updateStudent(student.id, 'email', e.target.value)
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={student.age}
                      onChange={e =>
                        updateStudent(
                          student.id,
                          'age',
                          parseInt(e.target.value)
                        )
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <select
                      value={student.course}
                      onChange={e =>
                        updateStudent(student.id, 'course', e.target.value)
                      }
                      className="form-control form-control-sm"
                    >
                      <option value="React">React</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Node.js">Node.js</option>
                      <option value="Python">Python</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.1"
                      value={student.grade}
                      onChange={e =>
                        updateStudent(
                          student.id,
                          'grade',
                          parseFloat(e.target.value)
                        )
                      }
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => deleteStudent(student.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Actions */}
      <div className="actions-section">
        <h3>Acciones de Base de Datos</h3>
        <div className="actions-grid">
          <button onClick={exportDatabase} className="btn btn-success">
            Exportar Base de Datos
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  '¿Estás seguro de que quieres limpiar toda la base de datos?'
                )
              ) {
                clearDatabase();
              }
            }}
            className="btn btn-warning"
          >
            Limpiar Base de Datos
          </button>
          <button
            onClick={() => {
              if (
                window.confirm(
                  '¿Quieres restaurar los datos de muestra? Esto eliminará todos los datos actuales.'
                )
              ) {
                restoreSampleData();
              }
            }}
            className="btn btn-info"
          >
            Restaurar Datos de Muestra
          </button>
          <button onClick={() => loadStudents()} className="btn btn-secondary">
            Recargar Datos
          </button>
        </div>
      </div>
    </div>
  );
};
