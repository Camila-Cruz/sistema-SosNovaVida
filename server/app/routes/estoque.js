const pg = require('pg');
const path = require('path');
const conn = require('../database/db-factory');
//const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/tcc';

module.exports = ( app ) => {

    app.get('/estoque', (req, res, next) => {
        console.log('Recebendo requisição GET em /estoque');
        const produtos = [];
        
        conn.query('SELECT * FROM estoque', null, (err, result) => {
            if (err) {
                // Renderiza a página corretamente apesar do erro
                return res.json(produtos);
                res.send(produtos).status(200);
            }
            result.rows.forEach(linha => produtos.push(linha));

            res.json(produtos).status(200);

        });
    });


    app.post('/estoque', ( req, res ) => {
        console.log('Recebendo requisição POST em /estoque');

        const produto = req.body;

        conn.query( 'INSERT INTO ESTOQUE ( descricao, qtd ) VALUES ($1, $2)', [ produto.descricao, produto.qtd ], ( err ) => { 
            if ( err ) return 'Ocorreu um erro: ' + err;

            if ( produto.qtd <= 0 ) return res.send( produto ).status( 200 );
            
            conn.query( 'SELECT id FROM estoque where DESCRICAO = $1', [produto.descricao], ( erro, result ) => {
                if ( erro ) return 'Ocorreu um erro: ' + erro;
                produto.id = result.rows[0].id;

                conn.query( 'INSERT INTO movimentacao ( descricao, tipo, qtd, data, id_produto ) VALUES ( $1, $2, $3, $4, $5 )', [produto.descricao, 'ENTRADA', produto.qtd, new Date(), produto.id ], ( erro2 ) => {
                    if ( erro2 ) return 'Ocorreu um erro: ' + erro2;
                    return res.send( produto ).status( 202 );
                });
            })

        })
    });

    app.put('/estoque/:id', ( req, res ) => {
        const produtoId = req.params.id;
        const produto = req.body;

        console.log('Recebendo requisição PUT em /estoque/' + produtoId);

        let query = '';
        let metodo = '';

        if ( produto.metodo == 1 ) {
            produto.qtd += parseInt( produto.qtdAlterar );
            tipo = 'ENTRADA';
        } else if ( produto.metodo == -1 ) {
            produto.qtd -= parseInt( produto.qtdAlterar );
            tipo = 'SAIDA'
        }
        
        conn.query( 'UPDATE estoque SET qtd=$1 where descricao=$2', [ produto.qtd, produto.descricao ], ( err ) => {
            if ( err ) return 'Ocorreu um erro ' + err;
        });

        conn.query( 'INSERT INTO movimentacao ( descricao, tipo, qtd, data, id_produto ) VALUES ( $1, $2, $3, $4, $5 )', [produto.descricao, tipo, produto.qtdAlterar, new Date(), produto.id ], ( err ) => {
            if ( err ) return 'Ocorreu um erro: ' + err;
            return res.send( produto ).status( 202 );
        });
    });

    /*
    app.get('/estoque', (req, res, next) => {
        /*let produtos = [{
            descricao: 'Arroz',
            tipo: 'Alimento',
            qtd: 1,   
            preco_entrada: 'R$ 100,00'
        }]
        const produtos = [];
        pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }
            // SQL Query > Select Data
            const query = client.query('SELECT * FROM produtos;');
            
            // Stream acolhidos back one row at a time
            query.on('row', (row) => {
                produtos.push(row);
            });
            // After all data is returned, close connection and return acolhidos
            query.on('end', () => {
                done();
                return res.json(produtos);
                res.send(produtos).status(200);
            });
        });

        console.log('Recebendo consulta em /estoque');
        //res.send(produtos).status(200);
    });*/
}