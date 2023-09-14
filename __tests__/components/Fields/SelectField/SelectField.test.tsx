import { render, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";

import SelectField from "../../../../src/components/Fields/SelectField/SelectField";
import * as TestRenderer from "react-test-renderer";
import React from "react";

const climateOptionsMock = [
    { value: 'Tropical', label: 'Tropical' },
    { value: 'Continental', label: 'Continental' },
];

afterEach(cleanup);

describe('SelectField Component', () => {
    it('renders without crashing', () => {
        render(<SelectField options={climateOptionsMock}
                            suffixIconData={<img src='test.jpg' alt='arrowDown' />}
                            dropdownStyle={{ display: 'block' }}
        />);
    });

    it('should render with default value', () => {
        const tree = TestRenderer.create(
            <SelectField defaultValue="Continental" options={climateOptionsMock} suffixIconData={<img src='test.jpg' alt='arrowDown' />}
                         dropdownStyle={{ display: 'block' }}/>
        );
        expect(tree).toMatchSnapshot();
    });

    it('', () => {
        const { getByRole } = render(
            <SelectField disabled options={climateOptionsMock} suffixIconData={<img src='test.jpg' alt='arrowDown' />}
                         dropdownStyle={{ display: 'block' }}/>
        );
        expect(getByRole('combobox')).toBeDisabled();
    });
});
