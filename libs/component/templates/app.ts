import {
    Component{{ lifecycleHooks }}
} from '@angular/core';

@Component({
    selector: '{{ selector }}',
    styles: [{{ styles }}],
    template: {{ template }}
})
export class {{ componentName }}Component{{ lifecycleImplements }} {{{ lifecycleMethods }}}