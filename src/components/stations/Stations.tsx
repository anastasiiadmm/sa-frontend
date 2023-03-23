import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStations, fetchWeather } from 'redux/stations/stationsSlice';

const Stations = () => {
  const dispatch = useAppDispatch();
  // const stations = useAppSelector((state) => state.stations.stations); добавить как будет ясно какие данные точно нужны
  // const weather = useAppSelector((state) => state.stations.weather);
  const status = useAppSelector((state) => state.stations.isLoading);

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  if (status) {
    return <div>Loading...</div>;
  }

  return null;
};

export default Stations;
