import * as Highcharts from 'highcharts';
import { ChartOptions } from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HCSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useRef, useState } from 'react';

import { ChartOption } from 'types/stationTypes';

HighchartsAccessibility(Highcharts);
HCMore(Highcharts);
HCSolidGauge(Highcharts);

Highcharts.seriesType('arearange', '', {});

interface Props {
  data: any;
}

const ChartComponent: React.FC<Props> = ({ data }) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const [chartAirAndDewPointOptions, setAirAndDewPointChartOptions] = useState<ChartOptions | null>(
    null,
  );
  const [chartPrecipitationOptions, setChartPrecipitationOptions] = useState<ChartOptions | null>(
    null,
  );
  const [chartGustOptions, setGustOptions] = useState<ChartOptions | null>(null);

  useEffect(() => {
    const filteredAirAndDewPointSeries =
      data &&
      data[0]?.series.filter(
        (series: ChartOption) =>
          series.name === 'HC Температура воздуха [°C]' || series.name === 'Точка росы [°C]',
      );
    const filteredPrecipitationSeries =
      data && data[1]?.series.filter((series: ChartOption) => series.name === 'Осадки [mm]');
    const filteredGustSeries =
      data && data[2]?.series.filter((series: ChartOption) => series.name === 'Порыв ветра [m/s]');

    const newChartAirAndDewPointOptions: ChartOptions = {
      ...data[0],
      series: filteredAirAndDewPointSeries,
    };

    const newChartPrecipitationOptions: ChartOptions = {
      ...data[1],
      series: filteredPrecipitationSeries,
    };

    const newChartGustOptions: ChartOptions = {
      ...data[2],
      series: filteredGustSeries,
    };

    setAirAndDewPointChartOptions(newChartAirAndDewPointOptions);
    setChartPrecipitationOptions(newChartPrecipitationOptions);
    setGustOptions(newChartGustOptions);
  }, [data]);

  return (
    <>
      <HighchartsReact
        ref={chartComponentRef}
        highcharts={Highcharts}
        options={chartAirAndDewPointOptions}
      />

      <HighchartsReact
        ref={chartComponentRef}
        highcharts={Highcharts}
        options={chartPrecipitationOptions}
      />

      <HighchartsReact ref={chartComponentRef} highcharts={Highcharts} options={chartGustOptions} />
    </>
  );
};

export default ChartComponent;
