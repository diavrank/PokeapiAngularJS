pokeapiApp.factory('PokemonServ', function ($http, $q, HttpRequestServ) {

    var service = {};

    service.HOSTNAME = 'https://pokeapi.co/api/v2/';
    service.ENDPOINT_POKEMON = service.HOSTNAME + 'pokemon/';
    const ENDPOINT_SINGLE_POKEMON = 'pokemon/';

    /**
     * Obtiene la información de un pokemon
     * @returns {*}
     */
    service.getPokemonInfo = function (pokemonName) {
        return HttpRequestServ.getRequest(service.HOSTNAME + ENDPOINT_SINGLE_POKEMON + pokemonName);
    };

    return service;

});

