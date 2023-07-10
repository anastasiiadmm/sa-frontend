import { render, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

import SelectField from "../../../../src/components/Fields/SelectField/SelectField";
import * as TestRenderer from "react-test-renderer";

jest.mock('antd', () => ({
    Select: ({ children, ...props }:any) => <select {...props}>{children}</select>,
}));

const climateOptionsMock = [
    { value: 'Tropical', label: 'Tropical' },
    { value: 'Continental', label: 'Continental' },
];

afterEach(cleanup);

describe('SelectField Component', () => {
    it('renders without crashing', () => {
        render(<SelectField options={climateOptionsMock} />);
    });

    it('should render with default value', () => {
        const tree = TestRenderer.create(
            <SelectField defaultValue="Continental" options={climateOptionsMock} />
        );
        expect(tree).toMatchSnapshot();
    });

    it('', () => {
        const { getByRole } = render(
            <SelectField disabled options={climateOptionsMock} />
        );
        expect(getByRole('combobox')).toBeDisabled();
    });
});
