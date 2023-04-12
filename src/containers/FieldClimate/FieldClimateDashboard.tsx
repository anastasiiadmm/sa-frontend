import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FieldClimateOpenMapComponent from 'components/FieldClimateOpenMapComponent/FieldClimateOpenMapComponent';
import FormField from 'components/FormField/FormField';
import Spinner from 'components/Spinner/Spinner';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStations, stationsSelector } from 'redux/stations/stationsSlice';
import { MarkerData } from 'types/stationTypes';
import { climateOptions } from 'utils/constants';
import 'containers/FieldClimate/_fieldClimateDashboard.scss';

const FieldClimateDashboard = () => {
  const b = bem('FieldClimateDashboard');
  const dispatch = useAppDispatch();
  const { stations, stationsLoading } = useAppSelector(stationsSelector);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>(climateOptions[4].value);

  useEffect(() => {
    dispatch(fetchStations());
  }, []);

  useEffect(() => {
    if (stations && Array.isArray(stations)) {
      const transformedData = stations?.map((item) => ({
        id: item?.name?.original,
        position: item?.position?.geo?.coordinates,
        name: item?.name?.custom,
        dates: item?.dates,
        meta: item?.meta,
      }));
      setMarkers(transformedData);
    }
  }, [stations]);

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <React.Suspense fallback={<Spinner />}>
      {stationsLoading && <Spinner />}
      {!stationsLoading && (
        <FieldClimateOpenMapComponent markers={markers} selectedOption={selectedOption} />
      )}
      <div className={b('')}>
        <div>
          <FormField
            type='select'
            defaultValue={climateOptions[4]}
            handleChange={handleChange}
            options={climateOptions}
          />
        </div>
      </div>
    </React.Suspense>
  );
};

export default FieldClimateDashboard;
