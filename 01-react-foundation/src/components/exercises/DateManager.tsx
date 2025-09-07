import { useState } from 'react';
import './DateManager.css';

export const DateManager = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [birthDate, setBirthDate] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const calculateAge = () => {
    if (!birthDate) {
      addResult('Por favor, selecciona una fecha de nacimiento');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    const nextBirthday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    addResult(`Edad: ${age} años`);
    addResult(`Días hasta el próximo cumpleaños: ${daysUntilBirthday}`);
  };

  const getDayOfWeek = () => {
    const date = new Date(selectedDate);
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    addResult(`${selectedDate} es un ${days[date.getDay()]}`);
  };

  const getDaysFromToday = () => {
    const selected = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    const diffTime = selected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      addResult('La fecha seleccionada es hoy');
    } else if (diffDays > 0) {
      addResult(`La fecha seleccionada es en ${diffDays} días`);
    } else {
      addResult(`La fecha seleccionada fue hace ${Math.abs(diffDays)} días`);
    }
  };

  const getMonthInfo = () => {
    const date = new Date(selectedDate);
    const month = date.getMonth();
    const year = date.getFullYear();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    addResult(`Mes: ${monthNames[month]} ${year}`);
    addResult(`Días en el mes: ${lastDay.getDate()}`);
    addResult(
      `Primer día: ${formatDate(firstDay.toISOString().split('T')[0])}`
    );
    addResult(`Último día: ${formatDate(lastDay.toISOString().split('T')[0])}`);
  };

  const addDays = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    const newDate = date.toISOString().split('T')[0];
    setSelectedDate(newDate);
    addResult(
      `${days > 0 ? 'Agregados' : 'Restados'} ${Math.abs(days)} días: ${formatDate(newDate)}`
    );
  };

  const isLeapYear = () => {
    const year = new Date(selectedDate).getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    addResult(`${year} ${isLeap ? 'es' : 'no es'} un año bisiesto`);
  };

  const getQuarter = () => {
    const month = new Date(selectedDate).getMonth();
    const quarter = Math.floor(month / 3) + 1;
    addResult(`La fecha está en el ${quarter}° trimestre del año`);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const dateTime = now.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    addResult(`Fecha y hora actual: ${dateTime}`);
  };

  return (
    <div className="date-manager-container">
      <h2>Manejo de Fechas</h2>

      <div className="date-inputs-section">
        <div className="input-group">
          <label htmlFor="selectedDate">Fecha a analizar:</label>
          <input
            type="date"
            id="selectedDate"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="input-group">
          <label htmlFor="birthDate">Fecha de nacimiento:</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="date-display">
        <h3>Fecha seleccionada:</h3>
        <div className="formatted-date">{formatDate(selectedDate)}</div>
      </div>

      <div className="operations-section">
        <h3>Operaciones con Fechas</h3>
        <div className="operation-buttons">
          <button onClick={getCurrentDateTime} className="btn btn-info">
            Fecha/Hora Actual
          </button>
          <button onClick={getDayOfWeek} className="btn btn-primary">
            Día de la Semana
          </button>
          <button onClick={getDaysFromToday} className="btn btn-success">
            Días desde Hoy
          </button>
          <button onClick={getMonthInfo} className="btn btn-warning">
            Info del Mes
          </button>
          <button onClick={calculateAge} className="btn btn-secondary">
            Calcular Edad
          </button>
          <button onClick={isLeapYear} className="btn btn-info">
            ¿Año Bisiesto?
          </button>
          <button onClick={getQuarter} className="btn btn-primary">
            Trimestre
          </button>
        </div>

        <div className="date-manipulation">
          <h4>Manipular Fecha</h4>
          <div className="manipulation-buttons">
            <button
              onClick={() => addDays(-365)}
              className="btn btn-outline-danger"
            >
              -1 Año
            </button>
            <button
              onClick={() => addDays(-30)}
              className="btn btn-outline-warning"
            >
              -1 Mes
            </button>
            <button
              onClick={() => addDays(-7)}
              className="btn btn-outline-secondary"
            >
              -1 Semana
            </button>
            <button
              onClick={() => addDays(-1)}
              className="btn btn-outline-primary"
            >
              -1 Día
            </button>
            <button
              onClick={() => addDays(1)}
              className="btn btn-outline-primary"
            >
              +1 Día
            </button>
            <button
              onClick={() => addDays(7)}
              className="btn btn-outline-secondary"
            >
              +1 Semana
            </button>
            <button
              onClick={() => addDays(30)}
              className="btn btn-outline-warning"
            >
              +1 Mes
            </button>
            <button
              onClick={() => addDays(365)}
              className="btn btn-outline-success"
            >
              +1 Año
            </button>
          </div>
        </div>
      </div>

      <div className="results-section">
        <h3>Resultados:</h3>
        <div className="results-box">
          {results.length === 0 ? (
            <p>No hay resultados aún...</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="result-item">
                {result}
              </div>
            ))
          )}
        </div>
        <button onClick={clearResults} className="btn btn-danger mt-2">
          Limpiar Resultados
        </button>
      </div>
    </div>
  );
};
