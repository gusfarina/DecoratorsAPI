import { Permissoes, Usuarios } from './controllers';
import { app } from './express';

const permissoes = new Permissoes();
const usuarios = new Usuarios();

app.listen(3001, () => {
    // eslint-disable-next-line no-console
    console.log('Servidor Inicializado!');
});
