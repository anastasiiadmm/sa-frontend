import React from 'react';
import { useParams } from 'react-router-dom';

const FieldClimateStation = () => {
  const { id } = useParams() as { id: string };

  return <div>FieldClimateStation</div>;
};

export default FieldClimateStation;
