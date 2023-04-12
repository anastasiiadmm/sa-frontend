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
  const [chartOptions, setChartOptions] = useState<ChartOptions | null>(null);

  useEffect(() => {
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

    setChartOptions(newChartOptions);
  }, [data]);

  return (
    <HighchartsReact
      ref={chartComponentRef}
      highcharts={Highcharts}
      options={data && chartOptions}
    />
  );
};

export default ChartComponent;
