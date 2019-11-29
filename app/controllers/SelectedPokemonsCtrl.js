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
            pageTitle: "Pokemones seleccionados"
        });
    }

});