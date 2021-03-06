angular.module('novaVida').controller('acolhidoCtrl', function( $scope, acolhido, acolhidoAPI, uf, listaAPI ){ 
    $scope.acolhidos = acolhido.data;
    //$scope.ufs = uf.data;
    $scope.ufs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
    $scope.modoDeAbertura = "criar";

    $scope.carregarAcolhidos = () => {
        acolhidoAPI.getAcolhidos().then((response) => {
            console.log(response.data);
        }).catch((err) => {
            swal("Opa...", "Houve um erro, tente novamente!", "error");
            console.log("Erro no get: " + err.message);
        });
    };

    $scope.cadastrarAcolhido = (acolhido) => {
        console.log("Chegou na controller");
        acolhidoAPI.setAcolhidos(acolhido).then((response) => {
            swal("Sucesso!", "Acolhido cadastrado com sucesso!", "success"); 
            console.log("Sucesso");
        }).catch((err) => {
            swal("Opa...", "Houve um erro, tente novamente!", "error");
            console.log("O erro é: " + err);
        });
    };

    $scope.alterarAcolhido = (acolhido) => {
        console.log("Chegou na controller");
        acolhidoAPI.putAcolhido(acolhido).then((response) => {
            swal("Sucesso!", "Acolhido cadastrado com sucesso!", "success"); 
            console.log("Sucesso");
        }).catch((err) => {
            swal("Opa...", "Houve um erro, tente novamente!", "error");
            console.log("O erro é: " + err);
        });
    };

    $scope.desativarAcolhido = (acolhido, estado) => {
        let txtModal = estado == 1? "ativar":"desativar";
        let txtAviso = estado == 1? "ativado":"desativado";
        swal({
            title: 'Atenção',
            text: "Deseja realmente " + txtModal + " este cadastro?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.value) {
                acolhidoAPI.setAcolhidoState(acolhido, estado).then((response) => {
                    swal("Sucesso!", "Cadastro " + txtAviso + " com sucesso!", "success"); 
                    console.log("Sucesso");
                    console.log(response.data)
                    $scope.acolhidos = response.data;
                }).catch((err) => {
                    swal("Opa...", "Houve um erro, tente novamente!", "error");
                    console.log("O erro é: " + err);
                });
            }
        });
    }

    $scope.criarLista = ( acolhidos ) => {
        $scope.modoDeAbertura = "criar";
        $scope.lista = []

        acolhidos.filter( ( acolhido ) => {
            if ( acolhido.selecionado ) {
                $scope.lista.push( acolhido );
            }; 
        });
    };

    $scope.salvarLista = ( lista ) => {
        console.log( 'Lista', lista);
        if ( $scope.modoDeAbertura === 'criar' ) {
            listaAPI.postListaAcolhido( lista )
                .then( () => {
                    $scope.lista = {
                        acolhidos: []
                    }
                    return swal("Sucesso!", "Lista salva com sucesso!", "success");
                })
                .catch( err => {
                    swal("Opa...", "Houve um erro, tente novamente!", "error");
                    return console.log('Erro: ' + err );
                })
        } else {
            listaAPI.putListaAcolhido(lista)
                .then(() => {
                    listaAPI.getListaAcolhido()
                    .then( result => {
                        $scope.listas = result.data;
                        return swal("Sucesso!", "Lista editada com sucesso!", "success");
                    })
                    .catch( err => {
                        swal("Opa...", "Houve um erro, tente novamente!", "error");
                        console.log('Erro: ' + err );
                    })
                })
                .catch(err => {
                    swal("Opa...", "Houve um erro, tente novamente!", "error");
                    return console.log('Erro: ' + err);
                });
        };
    };

    $scope.apagarLista = ( lista ) => {
        swal({
            title: 'Atenção',
            text: "Deseja realmente excluir a lista selecionada?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim'
        }).then( result => {
            if (result.value) {
                console.log( lista );
                listaAPI.deleteListaAcolhido( lista.id )
                    .then( () => {
                        listaAPI.getListaAcolhido()
                        .then( result => {
                            $scope.listas = result.data;
                            return swal("Sucesso!", "Lista apagada com sucesso!", "success")
                        })
                        .catch( err => {
                            swal("Opa...", "Houve um erro, tente novamente!", "error");
                            console.log('Erro: ' + err );
                        })
                    })
                    .catch( err => {
                        swal("Opa...", "Houve um erro, tente novamente!", "error");
                        return console.log('Erro: ' + err );
                    });
            }
        });
    };

    ///////////////////////////////////////     LISTAS     \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    $scope.carregarListas = () => {
        listaAPI.getListaAcolhido()
           .then( result => {
                $scope.listas = result.data;
           })
           .catch( err => {
                swal("Opa...", "Houve um erro, tente novamente!", "error");
                console.log('Erro: ' + err );
           })
    };

    $scope.obterLista = ( lista ) => {
        $scope.lista = [];
        $scope.lista.acolhidos = [];
        listaAPI.getListaAcolhidoById( lista.id )
            .then( result => {
                result.data.acolhidos[0].forEach( acolhido => {
                    $scope.lista.acolhidos.push({
                        id: acolhido.id,
                        nome: acolhido.nome,
                        data_nasc: acolhido.data_nasc,
                        camiseta: acolhido.camiseta,
                        calca: acolhido.calca,
                        intima: acolhido.intima,
                        calcado: acolhido.calcado
                    });
                })
                $scope.lista.nome = result.data.nome;
                $scope.lista.id = lista.id;
                $scope.modoDeAbertura = 'editar';
                console.log( 'Completa: ', $scope.lista );
            })
            .catch( err => {
                swal("Opa...", "Houve um erro, tente novamente!", "error");
                console.log('Erro: ' + err );
            })
    }

    $scope.adicionarItemNaLista = ( novoItem ) => {
        $scope.lista.acolhidos.push( novoItem );
        $scope.novoItem = {};
    };

    $scope.cancelarLista = () => {
        /*swal({
            title: 'Atenção',
            text: "Deseja realmente cancelar essa operação?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim'
        }).then( result => {
            if (result.value) {*/
                $scope.lista = {};
           /* }
        });*/
    };

    $scope.removeAcolhido = ( acolhido ) => {
        if ($scope.modoDeAbertura == 'editar' ) {
            $scope.lista.acolhidos = $scope.lista.acolhidos.filter( ( acolhidoLista ) => {
                if ( acolhidoLista.nome !== acolhido.nome ) return acolhidoLista; 
            })
        } else {
            $scope.lista = $scope.lista.filter( ( acolhidoLista ) => {
                if ( acolhidoLista.nome !== acolhido.nome ) return acolhidoLista;
            });
        }
    };

    $scope.voltar = () => {
        $location.path('/consulta/acolhido')
    }
});