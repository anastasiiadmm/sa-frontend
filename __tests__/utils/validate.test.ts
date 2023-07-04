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
        const file = {
            type: 'image/jpeg',
        };

        const result = fileValidateImg(file as File);

        expect(result).toBe(true);
    });

    it('', () => {
        const file = {
            type: 'application/pdf',
        };

        const result = fileValidateImg(file as File);

        expect(result).toBe(false);
        expect(message.error).toHaveBeenCalledWith('Неверный формат изображения');
    });
});

describe('fileSizeValidate', () => {
    it('', () => {
        const file = {
            size: 4000000,
        };

        const result = fileSizeValidate(file as File);

        expect(result).toBe(true);
    });

    it('', () => {
        const file = {
            size: 6000000,
        };

        const result = fileSizeValidate(file as File);

        expect(result).toBe(false);
        expect(message.error).toHaveBeenCalledWith('Размер изображения слишком большой');
    });
});
