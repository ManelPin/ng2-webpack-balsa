import {
    beforeEachProviders,
    describe,
    expect,
    inject,
    it
} from '@angular/core/testing';

import { {{ serviceName }}Service } from '../../../app/services/{{ filename }}.service.ts';

describe('Service: {{ serviceName }}', () =>{
    beforeEachProviders(() => [{{ serviceName }}Service]);

    it('should', inject([{{ serviceName }}Service], (service: {{serviceName }}Service) => {

    }));
});