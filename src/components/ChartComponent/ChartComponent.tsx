import * as Highcharts from 'highcharts';
import HCMore from 'highcharts/highcharts-more';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HCSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useState } from 'react';

import { Sensor } from 'types/stationTypes';

HighchartsAccessibility(Highcharts);
HCMore(Highcharts);
HCSolidGauge(Highcharts);

Highcharts.seriesType('arearange', '', {});

interface Props {
  data: Sensor[] | undefined | null;
}

const ChartComponent: React.FC<Props> = ({ data }) => {
  const [chartDataFirst, setChartDataFirst] = useState<Sensor | null>(null);
  const [chartDataSecond, setChartDataSecond] = useState<Sensor | null>(null);
  const [chartDataThird, setChartDataThird] = useState<Sensor | null>(null);
  const [chartDataFourth, setChartDataFourth] = useState<Sensor | null>(null);

  useEffect(() => {
    if (data) {
      setChartDataFirst(data[0]);
      setChartDataSecond(data[1]);
      setChartDataThird(data[2]);
      setChartDataFourth(data[3]);
    }
  }, [data]);

  return (
    <div data-testid='chart-id'>
      {chartDataFirst?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartDataFirst} />
      ) : null}

      {chartDataSecond?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartDataSecond} />
      ) : null}

      {chartDataThird?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartDataThird} />
      ) : null}

      {chartDataFourth?.series?.length ? (
        <HighchartsReact highcharts={Highcharts} options={chartDataFourth} />
      ) : null}
    </div>
  );
};

export default ChartComponent;
