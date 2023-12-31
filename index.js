import express from "express";
import path from 'path'

const port = 3000;
const host = 'localhost';

const app = express();

// Indicando uma pasta para a procura de arquivos estáticos;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'paginas')));

app.get('/', (req, res) => {
    res.end(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Meu do sistema</title>
        </head>
        <body>
            <h1>Menu</h1>
            <ul>
                <li><a href="/ControleFinanceiro.html">Cadastrar novas despesas</a></li>
            </ul>
        </body>
    </html>
    `);
});

const list = [] // Armazenar os dados

function controller(req, res) {
    const dados = req.body;
    let conteudoResposta = '';

    if (!dados.produto || !dados.preco) {
        conteudoResposta = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
            <title>Controle Financeiro</title>
        </head>
        <body>
            <form action="/ControleFinanceiro" method="post" class="row p-3 justify-content-center">
                <h1 class="row justify-content-center m-3">Controle Financeiro</h1>
                <div class="col-auto">
                    <label for="inputProduto" class="visually-hidden">Nome do Produto</label>
                    <input type="text" name="produto" class="form-control" id="inputProduto" value="${dados.produto}" required>
                </div>
                `;
        if (!dados.produto) {
            conteudoResposta += 
            `<div>
                <p class="text-danger">Por favor, informe o produto!</p>
            </div>`;
        }

        conteudoResposta += `
                <div class="col-md-4">
                    <label for="inputPreco" class="form-label">Preço</label>
                    <input type="text" class="form-control" id="inputPreco" name="preco" value="${dados.preco}" required>
                </div>
                `;
        if (!dados.preco) {
            conteudoResposta +=
                `<div>
                    <p class="text-danger">Por favor, informe o preço!</p>
                </div>`;
        }
        conteudoResposta += `
                <div class="col-auto">
                    <button type="submit" class="btn btn-success mb-3">Salvar</button>
                </div>
            </form>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossorigin="anonymous">
            </script>
        </body>
        </html>`;
        res.end(conteudoResposta);
    } else {
        const usuario = {
            produto: dados.produto,
            preco: parseFloat(dados.preco)
        }
        list.push(usuario)

        let ConteudoResultado = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Meu do sistema</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </head>
        <body>
            <h1>Despesas</h1>
            <table class="table table-striped">
                <thead class="thead-dark justify-content-center">
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Preço</th>
                    </tr>
                </thead>
                <tbody> `;

        let resultado = 0;
        for (const usuario of list) {
            resultado += usuario.preco;
            ConteudoResultado += `
                    <tr>
                        <td>${usuario.produto}</td>
                        <td>${usuario.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>      
                `;
        }

        ConteudoResultado += `
                </tbody>
            </table>
            <p><strong>Valor total:</strong> ${resultado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
            <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
            <a class="btn btn-primary" href="/ControleFinanceiro.html" role="button">Continuar cadastrando</a>
        </body>
        </html>`;
        res.end(ConteudoResultado);
    }
}

app.post('/ControleFinanceiro', controller);

app.listen(port, host, () => {
    console.log(`Servidor executando na url http://${host}:${port}`)
});
