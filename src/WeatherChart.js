import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./WeatherChart.css";

function WeatherChart() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [averageTemp, setAverageTemp] = useState(0);
  const [averageHumidity, setAverageHumidity] = useState(0);
  const [averagePressure, setAveragePressure] = useState(0);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState("General");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://ec2-98-81-173-38.compute-1.amazonaws.com:3000/api/v1/devices"
        );
        const result = await response.json();

        const weatherData = result.flatMap((device) =>
          device.Sensor.flatMap((sensor) =>
            sensor.WeatherData.map((entry) => ({
              temperature: entry.Data.temperature,
              humidity: entry.Data.humidity,
              pressure: entry.Data.pressure,
              CreationDate: entry.CreationDate,
            }))
          )
        );

        const sortedData = weatherData.sort(
          (a, b) => new Date(a.CreationDate) - new Date(b.CreationDate)
        );
        setData(sortedData);

        const days = Array.from(
          new Set(sortedData.map((item) => item.CreationDate.split("T")[0]))
        );
        setAvailableDays(days);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered =
      selectedDay === "General"
        ? data
        : data.filter((item) => item.CreationDate.startsWith(selectedDay));

    setFilteredData(filtered);

    const totalTemp = filtered.reduce((acc, item) => acc + item.temperature, 0);
    const totalHumidity = filtered.reduce((acc, item) => acc + item.humidity, 0);
    const totalPressure = filtered.reduce((acc, item) => acc + item.pressure, 0);

    setAverageTemp((totalTemp / filtered.length).toFixed(2) || 0);
    setAverageHumidity((totalHumidity / filtered.length).toFixed(2) || 0);
    setAveragePressure((totalPressure / filtered.length).toFixed(2) || 0);
  }, [selectedDay, data]);

  // Función para mostrar la fecha y hora en formato claro
  const formatXAxis = (tick) => {
    const date = new Date(tick);
    return date.toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="weather-dashboard p-2 m-2">
      <div className="boxt m-2">
        <h1 className="title fw-bold">Weather Station Dashboard 👨‍🔬🌡️</h1>
      </div>

      <div className="day-buttons my-5 px-5">
        <button
          onClick={() => setSelectedDay("General")}
          className={selectedDay === "General" ? "selected" : ""}
        >
          General
        </button>
        {availableDays.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={day === selectedDay ? "selected" : ""}
          >
            {formatDate(day)}
          </button>
        ))}
      </div>

      <div className="row mb-4 px-5">
        <div className="col-md-4">
          <div className="bg-white p-3 rounded shadow text-center">
            <h3>Temperatura Promedio (°C)</h3>
            <p>{averageTemp}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white p-3 rounded shadow text-center">
            <h3>Humedad Promedio (%)</h3>
            <p>{averageHumidity}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-white p-3 rounded shadow text-center">
            <h3>Presión Promedio (hPa)</h3>
            <p>{averagePressure}</p>
          </div>
        </div>
      </div>

      {/* Gráfica General */}
      <div className="bg-white p-3 rounded shadow mb-4 mx-5">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="CreationDate" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
            <Line type="monotone" dataKey="pressure" stroke="#ffc658" name="Pressure (hPa)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficas de Temperatura, Humedad y Presión en una sola fila */}
      <div className="row mx-5">
        {/* Gráfica de Temperatura */}
        <div className="col-md-4">
          <div className="bg-white p-3 rounded shadow mb-4">
            <h3 className="text-center">Temperatura (°C)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="CreationDate" tickFormatter={formatXAxis} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica de Humedad */}
        <div className="col-md-4">
          <div className="bg-white p-3 rounded shadow mb-4">
            <h3 className="text-center">Humedad (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="CreationDate" tickFormatter={formatXAxis} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica de Presión */}
        <div className="col-md-4">
          <div className="bg-white p-3 rounded shadow mb-4">
            <h3 className="text-center">Presión (hPa)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="CreationDate" tickFormatter={formatXAxis} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pressure" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="bg-white p-3 rounded shadow mx-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Temperatura (°C)</th>
              <th>Humedad (%)</th>
              <th>Presión (hPa)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.CreationDate).toLocaleString()}</td>
                <td>{item.temperature}</td>
                <td>{item.humidity}</td>
                <td>{item.pressure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeatherChart;

