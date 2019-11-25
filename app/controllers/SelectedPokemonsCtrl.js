pokeapiApp.controller('SelectedPokemonsCtrl', function($rootScope, $scope, $compile, DTOptionsBuilder, DTColumnBuilder,
                                                       PokemonServ) {

	/**
	 * Atributos del controlador
	 *
	 */
	$scope.pokemonsList = PokemonServ.pokemonsList;

	/**
	 * Escuchador para cambios de la lista
	 */
	$rootScope.$on('updatePokemonsList', function(event, data) {
		$scope.pokemonsList = data;
	});

});