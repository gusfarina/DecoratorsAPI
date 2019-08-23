import { Request, Response } from 'express';
import { controller, route } from '../decorators';

const dados = {
    items: [{ id: '41fdsa1sadv', name: 'John Doe', age: 20 }, { id: '419fdsajifd', name: 'Doe, John', age: 22 }],
};

@controller('/usuarios')
export class Usuarios {
    @route('/')
    listar(req: Request, res: Response) {
        res.status(200).json(dados);
    }

    @route('/getFirst')
    getFirst(req: Request, res: Response) {
        res.status(200).json({
            items: [dados.items[0]],
        });
    }
}
