import '@testing-library/jest-dom';
import {fileSizeValidate, fileValidateImg} from "../../src/utils/validate/validate";
import {message} from "antd";

jest.mock('antd', () => ({
    message: {
        error: jest.fn(),
    },
}));

describe('fileValidateImg', () => {
    it('', () => {
        const file:any = {
            type: 'image/jpeg',
        };

        const result = fileValidateImg(file);

        expect(result).toBe(true);
    });

    it('', () => {
        const file:any = {
            type: 'application/pdf',
        };

        const result = fileValidateImg(file);

        expect(result).toBe(false);
        expect(message.error).toHaveBeenCalledWith('Неверный формат изображения');
    });
});

describe('fileSizeValidate', () => {
    it('', () => {
        const file:any = {
            size: 4000000,
        };

        const result = fileSizeValidate(file);

        expect(result).toBe(true);
    });

    it('', () => {
        const file:any = {
            size: 6000000,
        };

        const result = fileSizeValidate(file);

        expect(result).toBe(false);
        expect(message.error).toHaveBeenCalledWith('Размер изображения слишком большой');
    });
});
