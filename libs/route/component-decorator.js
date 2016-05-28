'use strict';

module.exports = (file, selector) => {
    const componentDecorator = getComponentDecorator(file);
    const componentMetadata = getComponentMetadata(componentDecorator);
    let componentAttributes = getComponentAttributes(componentMetadata);
    let newAttributes;
    let newDecorator;

    componentAttributes = updateComponentDirectives(componentAttributes, 'directives', ['ROUTER_DIRECTIVES']);
    componentAttributes = updateComponentDirectives(componentAttributes, 'providers', ['ROUTER_PROVIDERS']);

    newAttributes = componentAttributes.map(getNewAttribute)
                        .join(',');
    newDecorator = componentDecorator.replace(componentMetadata, `{${newAttributes}\n}`);

    return file.replace(componentDecorator, newDecorator);
};

const getComponentDecorator = file => {
    let decorator = file.match(/\s*@Component\(\{[^\}]+\}\)/);

    if (decorator) {
        decorator = decorator[0];
    } else {
        throw 'Could not find @Component decorator in parent component!';
    }

    return decorator;
};

const getComponentMetadata = decorator => {
    let metadata = decorator.match(/\{([^\}])+\}/);

    if (metadata) {
        metadata = metadata[0];
    }

    return metadata;
};

const getComponentAttributes = metadata => {
    return metadata.replace(/(\{|\})/g, '')                     // replace curly braces
            .match(/\s*([^\:])+:\s*(\[[^\]]*\]|[^,])+,?/g)      // get all "attribute: value""
            .map(attribute => {
                let newAttribute = attribute.split(':');        // split each "attribute: value" on ":"

                newAttribute.push(newAttribute[0]);             // store the original attribute with spacing
                newAttribute[0] = newAttribute[0].trim();       // trim the attribute name
                newAttribute[1] = newAttribute[1].trim();       // trim the value

                // get rid of trailing commas
                if (newAttribute[1].slice(-1) === ',') {
                    newAttribute[1] = newAttribute[1].slice(0, -1);
                }

                return newAttribute;
            });
};

const updateComponentDirectives = (attributes, type, required) => {
    const directives = attributes.find(attribute => attribute[0] === type);
    let currentDirectives;

    if (directives) {
        currentDirectives = getCurrentDirectives(directives[1]);
        currentDirectives = addRequiredDirectives(currentDirectives, required);

        directives[1] = '[' + currentDirectives.join(', ') + ']';
    } else {
        attributes.push([type, '[' + addRequiredDirectives([], required) + ']', `\n    ${ type }`]);
    }

    return attributes;
};

const getCurrentDirectives = directives => {
    return directives.replace(/(\[|\])/g, '')
            .split(',');
};

const addRequiredDirectives = (directives, required) => {
    required.forEach(directive => {
        if (directives.indexOf(directive) === -1) {
            directives.push(directive);
        }
    });

    return directives;
};

const getNewAttribute = attribute =>  attribute[2] + ': ' + attribute[1];