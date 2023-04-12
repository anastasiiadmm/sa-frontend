import "@testing-library/jest-dom";
import {mockedDispatch, mockedUseSelectors} from "../../../__mocks__/utils";
import {screen, render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import "../../../__mocks__/matchMedia.mock";
import UserRequests from "../../../src/containers/Manager/UserRequests/UserRequests";
import ModalComponent from "../../../src/components/ModalComponent/ModalComponent";
import RequestAddTechnique
    from "../../../src/components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/RequestAddTechnique";

const dataTable = [
    {
        "id": 90,
        "created_at": "11-04-2023 22:12",
        "confirmation_type": 3,
        "inquiry_id": 98,
        "enterprise": 1,
        "confirmation_type_text": "Добавление техники",
        "enterprise_name": "ОсОО ОДА Дордой-Секьюрити"
    },
    {
        "id": 91,
        "created_at": "11-04-2023 22:12",
        "confirmation_type": 3,
        "inquiry_id": 99,
        "enterprise": 1,
        "confirmation_type_text": "Добавление техники",
        "enterprise_name": "ОсОО ОДА Дордой-Секьюрити"
    }
]
describe('UserRequests', () => {
    test('render table', () => {
        mockedUseSelectors.mockReturnValue({
            requests: dataTable
        });
        const dispatch = jest.fn();
        mockedDispatch.mockReturnValue(dispatch);
        render(<BrowserRouter>
                <UserRequests/>
            </BrowserRouter>
        )
        const getText = screen.queryAllByText('ОсОО ОДА Дордой-Секьюрити');
        expect(getText.length).toBe(2);
    })

    test('Modal render Technique', () => {
        mockedUseSelectors.mockReturnValue({});
        const dispatch = jest.fn();
        mockedDispatch.mockReturnValue(dispatch);
        const handleOkCancel = jest.fn();
        const resultsInfoClick = jest.fn();
        const showRejectModal = jest.fn();
        render(<ModalComponent open={true}>
                <RequestAddTechnique
                    resultsTechnique={{
                    "id": 98,
                    "image": "/media/vehicles/2023-02-10_18.54.40_lc8dCFk.jpg",
                    "processing_data": [],
                    "vin_code": "reref",
                    "code": "z8vf1f812",
                    "state_number": "refref",
                    "description": "ref",
                    "first_name": "test",
                    "middle_name": "test",
                    "last_name": "test",
                    "last_latitude": "0.000000",
                    "last_longitude": "0.000000",
                    "enterprise": 1
                }}
                  loading={false}
                   handleOkCancel={handleOkCancel}
                  resultsInfoClick={resultsInfoClick}
                  showRejectModal={showRejectModal}/>
            </ModalComponent>
        )
        const fioElement = screen.queryByDisplayValue('test test test') as HTMLInputElement;
        expect(fioElement.value).toBe('test test test')
    })
})