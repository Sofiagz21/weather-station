import React from 'react';
import Table from 'react-bootstrap/Table';

function DataTable({ data }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Temperatura (°C)</th>
          <th>Humedad (%)</th>
          <th>Presión (hPa)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{new Date(item.CreationDate).toLocaleString()}</td>
            <td>{item.temperature}</td>
            <td>{item.humidity}</td>
            <td>{item.pressure}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;