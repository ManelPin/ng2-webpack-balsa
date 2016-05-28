'use strict';

const utils = require('../utilities');

module.exports = (file, selector, parentSelector) => {
    const routeDecorator = getRouteDecorator(file);
    let lastRoute;

    if (routeDecorator) {
        file = addRouteToExistingRouter(file, selector, routeDecorator);
    } else {
        file = addNewRouter(file, selector, parentSelector);
    }

    return file;
};

const getRouteDecorator = file => {
    const decoratorMatches = file.match(/\s*@Routes\(\[[^\]]+\]\)/);
    let decorator;

    if (decoratorMatches) {
        decorator = decoratorMatches[0];
    }

    return decorator;
};

const addRouteToExistingRouter = (file, selector, routeDecorator) => {
    const allRoutes = getAllRoutes(routeDecorator);
    let newRouteDecorator;

    if (allRoutes && allRoutes.length > 0) {
        newRouteDecorator = updateRouteDecorator(routeDecorator, allRoutes, selector);
    } else {
        newRouteDecorator = `@Routes([${route}\n])`;
    }

    return file.replace(routeDecorator, newRouteDecorator);
};

const updateRouteDecorator = (decorator, allRoutes, selector) => {
    const route = getRoute(selector);
    const matchingRoute = allRoutes.find(existingRoute => {
        existingRoute = existingRoute.trim();

        if (existingRoute.slice(-1) === ',') {
            existingRoute = existingRoute.slice(0, -1);
        }

        return existingRoute === route.trim();
    });
    let lastRoute;

    if (!matchingRoute) {
        lastRoute = allRoutes.slice(-1)[0];
        decorator = decorator.replace(lastRoute, lastRoute + `,   ${ route }`)
    }

    return decorator;
};

const getAllRoutes = decorator => {
    const routes = decorator.match(/\s*\{[^\}]+\}/g)

    return routes;
};

const addNewRouter = (file, selector, parentSelector) => {
    const route = getRoute(selector);
    const classDeclaration = getClassDeclaration(file, parentSelector);

    return file.replace(classDeclaration, `\n@Routes([${route}\n])` + classDeclaration);
};

const getRoute = selector => {
    const component = utils.dashToCap(selector);

    return `\n    { component: ${ component }Component, path: '/${selector}' }`
};

const getClassDeclaration = (file, parentSelector) => {
    const parentName = utils.dashToCap(parentSelector);
    const exportClassRegex = new RegExp(`\\s*export\\s+class\\s+${ parentName }[^\\{]+{`);
    const declaration = file.match(exportClassRegex);

    if (!declaration) {
        throw `Could not find "export class ${ parentName } {" in parent component!`;
    }

    return declaration[0];
};