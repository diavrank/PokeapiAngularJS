pokeapiApp.controller('SelectedPokemonsCtrl', function ($rootScope, $scope, $compile, DTOptionsBuilder, DTColumnBuilder,
                                                        PokemonServ) {

    /**
     * Atributos del controlador
     *
     */
    $scope.pokemonsList = PokemonServ.pokemonsList;

    /**
     * Escuchador para cambios de la lista
     */
    $rootScope.$on('updatePokemonsList', (event, data) => {
        $scope.pokemonsList = data;
    });


    /**
     * Imprime la tabla de los pokemones seleccionados
     */
    $scope.printSelectedPokemons = () => {
        $("#tableSelectedPokemons").printThis({
            pageTitle: "Pokemones seleccionados",
            loadCSS: [
                "http://localhost:63342/PokeapiAngularJS/node_modules/bootstrap/dist/css/bootstrap.min.css",
                "http://localhost:63342/PokeapiAngularJS/node_modules/angular-datatables/dist/css/angular-datatables.min.css",
                "http://localhost:63342/PokeapiAngularJS/node_modules/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.min.css"
            ]
        });
    }

});