import '@testing-library/jest-dom';
import {getFilenameFromPath, urlFormat} from "../../src/utils/files/files";
import { apiUrlCrop } from 'utils/config';

describe('getFilenameFromPath', () => {
    it('', () => {
        const path = 'path/to/file.jpg';

        const result = getFilenameFromPath(path);

        expect(result).toBe('file.jpg');
    });

    it('', () => {
        const path = null;

        const result = getFilenameFromPath(path);

        expect(result).toBe('');
    });
});

describe('urlFormat', () => {
    it('', () => {
        const url = 'http://sa-backend/path/to/image.jpg';

        const result = urlFormat(url);

        expect(result).toBe(`${apiUrlCrop}path/to/image.jpg`);
    });

    it('', () => {
        const url = undefined;

        const result = urlFormat(url);

        expect(result).toBe('');
    });
});

