const con = require('../database/db-factory.js');

module.exports = (app) => {
  app.get( '/grafico/estoque', ( req, res ) => {
    console.log( 'Recebendo requisição GET em /grafico/estoque');

    const produtos = [];
    con.query('SELECT descricao, SUM(qtd) AS qtd FROM movimentacao WHERE tipo=$1 GROUP BY descricao ORDER BY qtd desc limit 5', ['SAIDA'], ( err, results ) => {
      if (err) {
        //return res.status(500);
        // Exibe tela mesmo com erro
        return res.status(200).send(produtos);
      }

      results.rows.forEach( ( element ) => {
        produtos.push( element ); 
      });

      return res.status(200).send( produtos );
    });
  });

  app.get( '/grafico/acolhidos', (req, res) => {
    const acolhidos = [];
    /*con.query('SELECT count(*) FROM acolhido WHERE dataSaida <= Date() and' + 
              ' dataEntrada >= Month(-1)', null, ( err, results ) => {*/
                // validar a query acima, provavelmente as funções Date() e Month(-1) darão erro
    con.query("select count(*) from acolhido where date_part('month', data_entrada) <= date_part('month', current_date)-1" +
              " and date_part('year', data_entrada) <= date_part('year', current_date)" +
              " and date_part('month', data_saida) >= date_part('month', current_date)-1" +
              " and date_part('year', data_saida) = date_part('year', current_date);", null, ( err, results ) => {
      if (err) {
        //return res.status(500);
        // Exibe tela mesmo com erro
        return res.status(200).send(produtos);
      }
      
      results.rows.forEach( (element) => {
        acolhidos.push( element );
      });

      return res.status(200).send( acolhidos )
    });
  });
};