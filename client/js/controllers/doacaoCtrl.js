angular.module('novaVida').controller('doacaoCtrl', function( $scope, doadorAPI, doacaoAPI ) {

  $scope.doacao = {};

  $scope.limpar = () => {
    $scope.doacao = {}
  }

  $scope.filtra = ( doador ) => {
    if ( doador == '' ) {
      $scope.buscando = false;
    } else {
      doadorAPI.getDoadorByNome( doador )
        .then( doadores => {
          $scope.buscando = true;
          $scope.dicas = doadores.data
          console.log( doadores.data );
        })
        .catch( err => {
          console.log( err );
        })
    }
  }

  $scope.adicionaDoador = ( doador ) => {
    $scope.doacao.nomeDoador = doador.nome;
    $scope.doacao.doador = doador;

    console.log( $scope.doacao );
    $scope.dicas = {};
  }

  $scope.cadastrarDoacao = ( doacao ) => {
    doacaoAPI.postDoacao( doacao )
      .then( () => {
          alert('Doacao inserida com sucesso');
          $scope.doacao = {};
        }
      )
      .catch( err => {
          alert('Algo deu errado, tente novamente');
          console.log( err );
        } 
      )
  } 

});