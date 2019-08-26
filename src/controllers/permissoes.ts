import { Request, Response, NextFunction } from 'express';
import { controller, route, security } from '../decorators';

const dados = {
    items: [
        {
            id: '41fdsa1sadv',
            type: 'standard',
            action: '@create',
            user: '41fdsa1sadv',
            permission: true,
        },
        {
            id: '41fdsa1sadv',
            type: 'standard',
            action: '@delete',
            user: '41fdsa1sadv',
            permission: true,
        },
        {
            id: '41fdsa1sadv',
            type: 'standard',
            action: '@list',
            user: '41fdsa1sadv',
            permission: true,
        },
        {
            id: '41fdsa1sadv',
            type: 'standard',
            action: '@get',
            user: '41fdsa1sadv',
            permission: true,
        },
    ],
};

function checkAuth(req: Request, res: Response, next: NextFunction): void {
    // eslint-disable-next-line
    console.log('Entrei Aqui!');
    req.headers = {
        ...req.headers,
        teste: 'Conteudo do Teste',
    };
    next();
}

function checkAuth2(req: Request, res: Response, next: NextFunction): void {
    // eslint-disable-next-line
    console.log('Entrei Aqui!');
    req.headers = {
        ...req.headers,
        teste2: 'Conteudo do Teste2',
    };
    next();
}

@controller('/permissoes')
@security(checkAuth2)
@security(checkAuth)
export class Permissoes {
    @route('/')
    listar(req: Request, res: Response) {
        res.send(req.headers);
    }
}
