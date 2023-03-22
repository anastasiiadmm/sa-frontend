import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStations } from 'redux/stations/stationsSlice';

const Stations = () => {
  const dispatch = useAppDispatch();
  const stations = useAppSelector((state) => state.stations.stations);
  const status = useAppSelector((state) => state.stations.isLoading);

  console.log(stations);

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  if (status) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      test
      {/*{stations.map((station) => (*/}
      {/*  <div key={station.id}>{station.name}</div>*/}
      {/*))}*/}
    </div>
  );
};

export default Stations;
