import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../../../__mocks__/matchMedia.mock';
import UploadImageComponent from "../../../src/components/UploadImageComponent/UploadImageComponent";
import {UploadFile} from "antd/es/upload/interface";

describe('UploadImageComponent', () => {
    let mockSetFileList: jest.Mock;
    let fileList: UploadFile[];

    beforeEach(() => {
        mockSetFileList = jest.fn();
        fileList = [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'http://localhost:3000/image.png',
        }];
    });

    it('renders without crashing', () => {
        const { getByTestId } = render(<UploadImageComponent fileList={fileList} setFileList={mockSetFileList} />);
        expect(getByTestId('image-upload')).toBeInTheDocument();
    });

    it('displays the plug image when no file is uploaded', () => {
        const { getByAltText } = render(<UploadImageComponent fileList={[]} setFileList={mockSetFileList} />);
        expect(getByAltText('plug')).toBeInTheDocument();
    });

});
