import { Request, Response, NextFunction } from 'express';
import { app } from '../express';

const ROUTES_DEFINITION = Symbol('routes');
export enum METHOD {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    PUT = 'PUT',
}

interface RouteDefinition {
    path: string;
    method: METHOD;
    value: (req: Request, res: Response) => void;
    middleValue: (req: Request, res: Response, next: NextFunction) => void;
}

// Middleware
export const security = (middleFunc: (req: Request, res: Response, next: NextFunction) => void) => {
    return function decorator(target: Function) {
        const internalRoutes = Object.getOwnPropertyDescriptor(target.prototype, ROUTES_DEFINITION);
        if (internalRoutes !== undefined) {
            const propValue: RouteDefinition[] = internalRoutes.value;
            propValue.forEach(routeValue => {
                // routeValue.middleValue.push(middleFunc);
                if (routeValue.middleValue === undefined) {
                    // eslint-disable-next-line
                    routeValue.middleValue = () => {};
                } else {
                    // eslint-disable-next-line
                    routeValue.middleValue = middleFunc;
                }
            });
        } else {
            console.log(internalRoutes, 'nao entrou no if');
        }
    };
};

export const controller = (path = '/undefined') => {
    return function decorator(target: Function) {
        const internalRoutes = Object.getOwnPropertyDescriptor(target.prototype, ROUTES_DEFINITION);
        if (internalRoutes !== undefined) {
            const finalRoutes: RouteDefinition[] = internalRoutes.value;
            finalRoutes.forEach(vRoute => {
                // eslint-disable-next-line no-console
                console.log('Entrei na Controller');
                console.log(`Defining route: ${path}${vRoute.path} for ${target.name}`);
                // let spread: Function[] = ...vRoute.middleValue;
                console.log();
                switch (vRoute.method) {
                    case METHOD.GET:
                        app.get(`${path}${vRoute.path}`, vRoute.middleValue, vRoute.value);
                        break;
                    case METHOD.DELETE:
                        app.delete(`${path}${vRoute.path}`, vRoute.value);
                        break;
                    case METHOD.PATCH:
                        app.patch(`${path}${vRoute.path}`, vRoute.value);
                        break;
                    case METHOD.POST:
                        app.post(`${path}${vRoute.path}`, vRoute.value);
                        break;
                    case METHOD.PUT:
                        app.put(`${path}${vRoute.path}`, vRoute.value);
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.error(`${target.name}: method ${vRoute.method} is unknow`);
                        break;
                }
            });
        }
    };
};

export const route = (path: string, method: METHOD = METHOD.GET) => {
    return function decorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log('Entrei no decorator de Rota');
        const originalFunc = descriptor.value;
        const internalRoutes = Object.getOwnPropertyDescriptor(target, ROUTES_DEFINITION);
        let finalRoutes: RouteDefinition[];
        if (internalRoutes === undefined) {
            finalRoutes = [];
        } else {
            finalRoutes = internalRoutes.value;
        }
        finalRoutes.push({
            method,
            path,
            value: originalFunc,
            middleValue: (req: Request, res: Response, next: NextFunction) => {},
        });
        Object.defineProperty(target, ROUTES_DEFINITION, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: finalRoutes,
        });
    };
};
