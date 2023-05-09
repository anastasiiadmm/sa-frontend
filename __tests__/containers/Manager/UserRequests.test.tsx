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
        "requestor": "ОсОО ОДА Дордой-Секьюрити"
    },
    {
        "id": 91,
        "created_at": "11-04-2023 22:12",
        "confirmation_type": 3,
        "inquiry_id": 99,
        "enterprise": 1,
        "confirmation_type_text": "Добавление техники",
        "requestor": "ОсОО ОДА Дордой-Секьюрити"
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
        const showRejectModal = jest.fn();
        render(<ModalComponent open={true}>
                <RequestAddTechnique
                    resultsTechnique={{
                        "id": 85,
                        "category": 3,
                        "object_id": 81,
                        "created_at": "09/05/2023 01:02:17+0600",
                        "requestor": {
                            "name": "test"
                        },
                        "data": {
                            "vehicle": {
                                "vin": "fref",
                                "license_plate": "frefre",
                                "description": "refre"
                            },
                            "operator": {
                                "first_name": "rfef",
                                "last_name": "refref",
                                "middle_name": "refrefr"
                            }
                        },
                        "uploaded_files": [
                            {
                                "id": 15,
                                "file": "http://sa-backend/media/files/inquiries/85/2023-02-10_18.54.40.jpg"
                            }
                        ]
                    }}
                  loading={false}
                   handleOkCancel={handleOkCancel}
                    modalOpen={() => {}}
                  showRejectModal={showRejectModal}/>
            </ModalComponent>
        )
        const fioElement = screen.queryByDisplayValue('rfef') as HTMLInputElement;
        expect(fioElement.value).toBe('rfef')
    })
})
