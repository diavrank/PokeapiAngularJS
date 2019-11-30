pokeapiApp.controller('PokemonCtrl', function ($rootScope, $scope, $compile, DTOptionsBuilder, DTColumnBuilder,
                                               PokemonServ, AlertServ, DomServ) {

    /**
     * Atributos del controlador
     */
    $scope.dtInstance = {};
    $scope.pokemonsPage = [];
    $scope.pokemonsList = [];
    $scope.pokemonTemp = {};
    $scope.searchPokemon = '';
    $scope.PATH_VIEW_MODAL_SELECTED_POKEMONS = './../partials/pokemon/selectedPokemons.html';
    $scope.PATH_VIEW_MODAL_INFO_POKEMON = './../partials/pokemon/pokemonInfo.html';
    const PAGE_SIZE = 10;
    const LIMIT_POKEMONS_FOR_LIST = 10;
    const ENTER_KEY = 13;

    /**
     * Configuración del tablero
     */
    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
        dataSrc: (data) => {
            let finalData = [];
            if (data.results) {
                data['data'] = data.results;
                data['recordsFiltered'] = data.count;
                data['recordsTotal'] = data.count;
                finalData = data.results;
            } else {
                finalData.push(data);
                data['recordsFiltered'] = 1;
                data['recordsTotal'] = 1;
            }
            AlertServ.closeAlert();
            $scope.pokemonsPage = finalData;
            $scope.$applyAsync();
            // console.info('Datos a recibir: ', data);
            return finalData;
        },
        data: (data) => {
            data['offset'] = data.start;
            data['limit'] = data.length;
            $scope.searchPokemon = data.search.value;
            $scope.$applyAsync();
            // console.info('Datos a enviar: ', data);
            return data;
        },
        beforeSend: (xhr, settings) => {
            // console.log("xhr: ", xhr);
            // console.log("settings: ", settings);
            if ($scope.searchPokemon !== "") {
                settings.url = PokemonServ.ENDPOINT_POKEMON + $scope.searchPokemon;
            }
        },
        error: (e) => {
            // console.error('Ocurrió un error al cargar los datos: ', e);
            AlertServ.showAlert("No se encontró el pokemón", AlertServ.DANGER,
                "alertMessageStateSearch", $scope);
            $scope.$applyAsync();
        },
        url: 'https://pokeapi.co/api/v2/pokemon/',
        type: 'GET',
    })
        .withOption('processing', true) //para mostrar el estado del progreso
        .withOption('serverSide', true) // para Server-Side Processing (Paginación de lado del servidor)
        .withOption('createdRow', (row, data, dataIndex) => {
            // Para agregar directivas de angular al datatable
            $compile(angular.element(row).contents())($scope);
        })
        .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
        .withDisplayLength(PAGE_SIZE) // Page size
        .withLanguage({
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningún dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
                'sFirst': 'Primero',
                'sLast': 'Último',
                'sNext': 'Siguiente',
                'sPrevious': 'Anterior',
            },
            'oAria': {
                'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                'sSortDescending': ': Activar para ordenar la columna de manera descendente',
            },
        })
        .withBootstrap();

    /**
     * Configuramos el buscador para realizar la busqueda despues del enter
     */
    $(document).ready(function () {
        var oTable = $('#datatablePokemons').dataTable();
        $('#datatablePokemons_filter input').unbind();
        $('#datatablePokemons_filter input').bind('keyup', function (e) {
            if (e.keyCode == ENTER_KEY) {
                oTable.fnFilter(this.value);
            }
        });
    });
    /**
     * Columnas de la tabla
     */

    $scope.dtColumns = [
        //Agregamos .withOption('name','column_name') para enviar los nombres de las columnas al servidor
        DTColumnBuilder.newColumn('name', 'Nombre').withOption('name', 'name').notSortable(),
        DTColumnBuilder.newColumn(null, 'Seleccionar').notSortable()
            .renderWith((data, type, full, meta) => {
                let pokemon = searchPokemonInPokemonsList(data.name);
                let disabledCheck = ($scope.pokemonsList.length >= LIMIT_POKEMONS_FOR_LIST && pokemon === null);
                let checkedPokemon = (pokemon !== null);
                return '<div class="text-center pokemon-checkbox"><label>' +
                    '<input type="checkbox" name="" ng-disabled="' + disabledCheck + '" ng-checked="' + checkedPokemon + '"' +
                    ' ng-click="addPokemonToPokemonsList(' + '\'' + data.name + '\'' + ')">' +
                    '</label></div>';
            }),
        DTColumnBuilder.newColumn(null, 'Información').notSortable()
            .renderWith((data, type, full, meta) => {
                return '<div class="text-center"><button class="btn btn-info" ' +
                    'ng-click="viewPokemonInfo(' + '\'' + data.name + '\'' + ')">' +
                    '<span class="glyphicon glyphicon-eye-open"></span>' +
                    '</button></div>';
            }),
    ];

    /**
     * Busca una pokemon dentro del tablero
     * @param nombrePokemon
     * @return Regresa el objeto del pokemon
     */
    var searchPokemonInDatatable = function (nombrePokemon) {
        let pokemon = null;
        for (let pokemonTemp of $scope.pokemonsPage) {
            if (nombrePokemon == pokemonTemp.name) {
                pokemon = pokemonTemp;
                break;
            }
        }
        return pokemon;
    };

    /**
     * Busca un pokemon dentro de la lista de pokemones seleccionados
     * @param pokemonName
     * @return Regresa el objeto del pokemon
     */
    var searchPokemonInPokemonsList = (pokemonName) => {
        let pokemon = null;
        for (let pokemonTemp of $scope.pokemonsList) {
            if (pokemonName == pokemonTemp.name) {
                pokemon = pokemonTemp;
                break;
            }
        }
        return pokemon;
    };

    /**
     * Remueve un elemento de la lista de pokemones seleccionados
     * @param pokemonName
     */
    var removeElementFromPokemonsList = (pokemonName) => {
        let indexPokemon = null;
        $scope.pokemonsList.some((pokemonTemp, index) => {
            if (pokemonTemp.name == pokemonName) {
                indexPokemon = index;
                return;
            }
        });
        $scope.pokemonsList.splice(indexPokemon, 1);
        $(".pokemon-checkbox input").attr("disabled", false)
    };

    /**
     * Agrega una pokemon a la lista de pokemones
     * @param pokemonName
     */
    $scope.addPokemonToPokemonsList = (pokemonName) => {
        // console.log('Nombre del pokemon: ', pokemonName);
        let pokemon = searchPokemonInPokemonsList(pokemonName);
        if (pokemon) {
            removeElementFromPokemonsList(pokemonName);
        } else {

            if ($scope.pokemonsList.length < LIMIT_POKEMONS_FOR_LIST) {
                pokemon = searchPokemonInDatatable(pokemonName);
                $scope.pokemonsList.push(pokemon);
                if ($scope.pokemonsList.length === LIMIT_POKEMONS_FOR_LIST) {
                    $(".pokemon-checkbox input").each(function (index, elem) {
                        $(elem).attr("disabled", !($(elem).prop("checked")));
                    });
                }
            } else {
                console.warn('Ha llegado al limite de selección de pokemones');
            }
        }
    };

    /**
     * Visualiza la lista de los pokemones seleccionados
     */
    $scope.viewPokemonsList = async () => {
        // console.log('PokemonsList: ', $scope.pokemonsList);
        // console.log('PokemonsPage: ', $scope.pokemonsPage);
        let pokemonsInfo = [];
        for (let selectedPokemon of $scope.pokemonsList) {
            try {
                let pokemon = await PokemonServ.getPokemonInfo(selectedPokemon.name);
                pokemonsInfo.push(pokemon);
            } catch (e) {
                console.error("Ha ocurrido un error al cargar la información de algún pokemon: ", e);
            }
        }
        $scope.$applyAsync();
        $rootScope.$emit('updatePokemonsList', pokemonsInfo);
        $('#selectedPokemonsModal').modal();
    };

    /**
     * Visualiza la información de un pokemon en especifico
     * @param pokemonName
     * @returns {Promise<void>}
     */
    $scope.viewPokemonInfo = async (pokemonName) => {
        $scope.pokemonTemp = {};
        try {
            let pokemon = await PokemonServ.getPokemonInfo(pokemonName);
            $scope.pokemonTemp = pokemon;
            $scope.$applyAsync();
            $('#pokemonInfoModal').modal();
        } catch (e) {
            console.error('Ocurrio un error al recuperar la información');
        }
    };

});