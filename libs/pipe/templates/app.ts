import { Pipe, PipeTransform } from '@angular/core';{{ typeImports }}

@Pipe({ name: '{{ pipeCamelName }}' })
export class {{ pipeClassName }}Pipe implements PipeTransform {
    transform(value: {{ inputType }}{{ additionalArguments }}): {{ outputType }} {
    }
}