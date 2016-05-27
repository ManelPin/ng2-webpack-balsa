import {
    Component{{ lifecycleHooks }}
} from '@angular/core';

@Component({
    selector: '{{ selector }}'{{ inlineStyles }},
    template: {{ template }}
})
export class {{ componentName }}Component{{ lifecycleImplements }} {{{ lifecycleMethods }}}