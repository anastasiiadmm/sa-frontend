import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {initialState, obtainingCoordinate} from "../../src/redux/map/mapSlice";

jest.mock('../../src/redux/store');
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('mapSlice extraReducers', () => {
    let store:any;

    beforeEach(() => {
        store = mockStore({
            map: initialState,
        });
    });

    it('', () => {
        store.dispatch(obtainingCoordinate({ id: 1, field_name: 'example' }));
        const actions = store.getActions();
        const expectedAction = {
            type: obtainingCoordinate.pending.type,
        };
        expect(actions[0].type).toBe(expectedAction.type)
    });

    it('', () => {
        const payload = {
            "id": 20,
            "description": "Трактор поливалка тестовая",
            "image": "http://backend/media/vehicles/20/veh.jpg",
            "code": "WDRG83N4",
            "speed": 0,
            "last_latitude": 42.85764,
            "last_longitude": 74.6001,
            "task_UID": "Potato field",
            "point_A_lat": 44.064337387,
            "point_A_lon": 56.502656187,
            "point_B_lat": 44.063929106,
            "point_B_lon": 56.5162862062,
            "tool_width": "12",
            "job_id": 85
        };
        // @ts-ignore
        store.dispatch(obtainingCoordinate.fulfilled(payload));
        const actions = store.getActions();
        const expectedAction = {
            type: obtainingCoordinate.fulfilled.type,
            payload,
        };
        expect(actions[0].type).toBe(expectedAction.type);
        expect(actions[0].payload).toBe(expectedAction.payload);
    });

    it('', () => {
        const payload = { detail: 'Error detail', status: 404 };
        // @ts-ignore
        store.dispatch(obtainingCoordinate.rejected(payload));
        const actions = store.getActions();
        const expectedAction = {
            type: obtainingCoordinate.rejected.type,
            payload,
        };
        expect(actions[0].type).toBe(expectedAction.type);
        expect(expectedAction.payload).toBe(payload);

    });
});


