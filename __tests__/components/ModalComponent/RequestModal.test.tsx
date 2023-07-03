import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import RequestModal
    from "../../../src/components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/RequestModal";

describe('RequestModal', () => {
    let handleDeleteCancel:any;
    let requestHandler:any;

    beforeEach(() => {
        handleDeleteCancel = jest.fn();
        requestHandler = jest.fn();
    });

    it('renders title and subTitle', () => {
        const { getByText } = render(
            <RequestModal
                title='Test title'
                subTitle='Test subTitle'
                loading={false}
                handleDeleteCancel={handleDeleteCancel}
                requestHandler={requestHandler}
                textCancel='Cancel'
            />
        );

        expect(getByText('Test title')).toBeInTheDocument();
        expect(getByText('Test subTitle')).toBeInTheDocument();
    });

    it('triggers handleDeleteCancel on cancel button click', async () => {
        const { getByText } = render(
            <RequestModal
                title='Test title'
                subTitle='Test subTitle'
                loading={false}
                handleDeleteCancel={handleDeleteCancel}
                requestHandler={requestHandler}
                textCancel='Cancel'
            />
        );

        fireEvent.click(getByText('Отменить'));
        await waitFor(() => expect(handleDeleteCancel).toHaveBeenCalledTimes(1));
    });

    it('triggers requestHandler on confirm button click', async () => {
        const { getByText } = render(
            <RequestModal
                title='Test title'
                subTitle='Test subTitle'
                loading={false}
                handleDeleteCancel={handleDeleteCancel}
                requestHandler={requestHandler}
                textCancel='Confirm'
            />
        );

        fireEvent.click(getByText('Confirm'));
        await waitFor(() => expect(requestHandler).toHaveBeenCalledTimes(1));
    });
});
