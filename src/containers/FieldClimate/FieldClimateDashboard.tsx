import React, { useEffect, useState } from 'react';

import FieldClimateOpenMapComponent from 'components/FieldClimateOpenMapComponent/FieldClimateOpenMapComponent';
import Spinner from 'components/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStations, stationsSelector } from 'redux/stations/stationsSlice';
import { MarkerData } from 'types/stationTypes';

const FieldClimateDashboard = () => {
  const dispatch = useAppDispatch();
  const { stations, stationsLoading } = useAppSelector(stationsSelector);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    dispatch(fetchStations());
  }, []);

  useEffect(() => {
    if (stations && Array.isArray(stations)) {
      const transformedData = stations?.map((item: any) => ({
        position: item?.position?.geo?.coordinates,
        name: item?.name?.custom,
      }));
      setMarkers(transformedData);
    }
  }, [stations]);

  return (
    <React.Suspense fallback={<Spinner />}>
      {stationsLoading && <Spinner />}
      {!stationsLoading && <FieldClimateOpenMapComponent markers={markers} />}
    </React.Suspense>
  );
};

export default FieldClimateDashboard;
