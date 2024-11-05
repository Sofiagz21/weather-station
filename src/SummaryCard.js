import React from 'react';
import Card from 'react-bootstrap/Card';

function SummaryCard({ title, value }) {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{value}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SummaryCard;