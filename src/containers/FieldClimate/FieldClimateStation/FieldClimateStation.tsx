import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStationSensors, stationsSelector } from 'redux/stations/stationsSlice';

const FieldClimateStation = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const { sensors, sensorsLoading } = useAppSelector(stationsSelector);

  useEffect(() => {
    dispatch(fetchStationSensors({ id }));
  }, [dispatch]);

  return <div>FieldClimateStation</div>;
};

export default FieldClimateStation;
