import "@testing-library/jest-dom";
import { render } from '@testing-library/react';
import ChartComponent from "../../../src/components/ChartComponent/ChartComponent";

describe('ChartComponent', () => {
    const mockData:any = [
        { series: [{ data: [1, 2, 3] }] },
        { series: [{ data: [4, 5, 6] }] },
        { series: [] },
        null,
    ];

    const nullData:any = [
        null,
        null,
        null,
        null,
    ];

    const undefinedData:any = [
        undefined,
        undefined,
        undefined,
        undefined,
    ];

    it('should render 2 HighchartsReact components when data is available', () => {
        const { container } = render(<ChartComponent data={mockData} />);
        const chartComponents = container.querySelectorAll('.highcharts-root');
        expect(chartComponents.length).toBe(2);
    });

    it('should not render HighchartsReact component when data is null', () => {
        const { container } = render(<ChartComponent data={nullData} />);
        const chartComponents = container.querySelectorAll('.highcharts-root');
        expect(chartComponents.length).toBe(0);
    });

    it('should not render HighchartsReact component when data is undefined', () => {
        const { container } = render(<ChartComponent data={undefinedData} />);
        const chartComponents = container.querySelectorAll('.highcharts-root');
        expect(chartComponents.length).toBe(0);
    });
});
