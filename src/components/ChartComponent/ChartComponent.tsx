import * as Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HCSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useState } from 'react';

import { ChartOption } from 'types/stationTypes';

HighchartsAccessibility(Highcharts);
HCMore(Highcharts);
HCSolidGauge(Highcharts);

Highcharts.seriesType('arearange', '', {});

interface Props {
  data: any;
}

const ChartComponent: React.FC<Props> = ({ data }) => {
  const [chartAirAndDewPointOptions, setAirAndDewPointChartOptions] = useState<ChartOption | null>(
    null,
  );
  const [chartPrecipitationOptions, setChartPrecipitationOptions] = useState<ChartOption | null>(
    null,
  );
  const [chartGustOptions, setGustOptions] = useState<ChartOption | null>(null);

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

    const newChartAirAndDewPointOptions: ChartOption = {
      ...data[0],
      series: filteredAirAndDewPointSeries,
    };

    const newChartPrecipitationOptions: ChartOption = {
      ...data[1],
      series: filteredPrecipitationSeries,
    };

    const newChartGustOptions: ChartOption = {
      ...data[2],
      series: filteredGustSeries,
    };

    setAirAndDewPointChartOptions(newChartAirAndDewPointOptions);
    setChartPrecipitationOptions(newChartPrecipitationOptions);
    setGustOptions(newChartGustOptions);
  }, [data]);

  return (
    <>
      {chartAirAndDewPointOptions?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartAirAndDewPointOptions} />
      ) : null}

      {chartPrecipitationOptions?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartPrecipitationOptions} />
      ) : null}

      {chartGustOptions?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartGustOptions} />
      ) : null}
    </>
  );
};

export default ChartComponent;
