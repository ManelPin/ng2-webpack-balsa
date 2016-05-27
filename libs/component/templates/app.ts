import {
    Component{{ lifecycleHooks }}
} from '@angular/core';

@Component({
    selector: '{{ selector }}',
    styles: [require('./{{ selector }}.component.scss')],
    template: require('./{{ selector }}.component.html')
})
export class {{ componentName }}Component{{ lifecycleImplements }} {{{ lifecycleMethods }}}