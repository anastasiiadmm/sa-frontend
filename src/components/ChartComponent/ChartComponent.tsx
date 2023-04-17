import Highcharts, { ChartOptions } from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HCSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

import { ChartOption } from 'types/stationTypes';

HCMore(Highcharts);
HCSolidGauge(Highcharts);
HighchartsAccessibility(Highcharts);

Highcharts.seriesType('arearange', '', {});

interface Props {
  data: any;
}

const ChartComponent: React.FC<Props> = ({ data }) => {
  const filteredAirAndDewPointSeries =
    data &&
    data[0]?.series.filter(
      (series: ChartOption) =>
        series.name === 'HC Температура воздуха [°C]' || series.name === 'Точка росы [°C]',
    );

  const newChartOptions: ChartOptions = {
    ...data[0],
    series: filteredAirAndDewPointSeries,
  };

  return <HighchartsReact highcharts={Highcharts} options={data && newChartOptions} />;
};

export default ChartComponent;
