/*
    Arquivo que guarda as rotas da aplicação
*/
angular.module('novaVida').config( ($routeProvider) => {
    //quando a rota for /estoque
    $routeProvider.when('/estoque', {
        //carregará a view localizada na url abaixo
        templateUrl: 'view/consultaEstoque.html',
        //o controller da view será estoqueCtrl, declarado no arquivo /controllers/estoqueCtrl
        controller: 'estoqueCtrl',
        //porém, só irá realizar todo o acima somente após a condição abaixo ser realizada, ou seja
        // é um pré-requisito
        resolve: {
            // este nome 'estoque' é o nome do que deve ser injetado no controller
            estoque: (estoqueAPI) => {
                //aqui é invocado o método _getEstoque() de estoqueAPI.
                return estoqueAPI.getEstoque();
            }
        }
    });

    // Rota para as movimentações no estoque
    $routeProvider.when('/movimentacao', {
        templateUrl: 'view/formMovimentacao.html',
        controller: 'movimentacaoCtrl',
        resolve: {
            movimentacao: (movimentacaoAPI) => {
                return movimentacaoAPI.getMovimentacao();
            }
        }
    });

    $routeProvider.when('/consulta/acolhido', {
        templateUrl: 'view/consultaAcolhido.html',
        controller: 'acolhidoCtrl',
        resolve: {
            acolhido: (acolhidoAPI) => {
                return acolhidoAPI.getAcolhidos();
            },
            uf: (ufAPI) => {
                return ufAPI;
            }
        }
    });
    $routeProvider.when('/consulta/doador', {
        templateUrl: 'view/consultaDoador.html',
        controller: 'doadorCtrl',
        resolve: {
            doadorGet: (doadorAPI) => {
                return doadorAPI.getDoadores();
            },
            uf: (ufAPI) => {
                return ufAPI;
            }
        }
    });
    $routeProvider.when('/consulta/doador/:id', {
        templateUrl: 'view/detalhesDoador.html',
        controller: 'detalhesDoadorCtrl',
        resolve: {
            doadorGet: (doadorAPI, $route) => {
                return doadorAPI.getDoadorById( $route.current.params.id );
            },
            uf: (ufAPI) => {
                return ufAPI.getUF();
            }
        }
    });
    $routeProvider.when('/consulta/acolhido/:id', {
        templateUrl: 'view/detalhesAcolhido.html',
        controller: 'detalhesAcolhidoCtrl',      //acolhidoCtrl
        resolve: {
            acolhido: (acolhidoAPI, $route) => {
                return acolhidoAPI.getAcolhidoByID( $route.current.params.id );
            },
            uf: ( ufAPI ) => {
                return ufAPI;
            }
        }
    });
    $routeProvider.when('/consulta/doacao', {
        templateUrl: 'view/consultaDoacao.html',
        controller: 'consultaDoacoesCtrl',
        resolve: {
            doacoes: ( doacaoAPI ) => {
                return doacaoAPI.getDoacoes();
            }
        }
    });
});