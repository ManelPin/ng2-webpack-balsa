import {
    beforeEachProviders,
    describe,
    expect,
    inject,
    it
} from '@angular/core/testing';

import { {{ pipeClassName }}Pipe } from '../../../app/pipes/{{ pipeName }}.pipe';

describe('Pipe: {{ pipeCamelName }}', () => {
    beforeEachProviders(() => [ {{ pipeClassName }}Pipe ]);

    it('should', inject([ {{ pipeClassName }}Pipe ], (pipe: {{ pipeClassName }}Pipe) => {
        expect(pipe.transform(true)).toBe(null);
    }));
});