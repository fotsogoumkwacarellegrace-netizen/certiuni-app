jest.mock('../../src/config/env.config', () => ({ env: {} }));

import { FilesService } from '../../src/modules/files/files.service';

describe('FilesService', () => {
    it('returns a 501 not-configured response when storage credentials are absent', async () => {
        const service = new FilesService();

        await expect(service.getPresignedDownloadUrl('file-key')).rejects.toMatchObject({
            status: 501,
            response: {
                error: 'not_configured',
                feature: 'storage',
            },
        });
    });
});
