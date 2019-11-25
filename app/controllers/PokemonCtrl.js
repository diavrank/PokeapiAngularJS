pokeapiApp.controller('PokemonCtrl', function($rootScope, $scope, $compile, DTOptionsBuilder, DTColumnBuilder,
                                              PokemonServ) {

	/**
	 * Atributos del controlador
	 */
	$scope.dtInstance = {};
	$scope.pokemonsPage = [];
	$scope.pokemonsList = [];
	$scope.pokemonTemp = {};
	$scope.PATH_VIEW_MODAL_SELECTED_POKEMONS = './../partials/pokemon/selectedPokemons.html';
	$scope.PATH_VIEW_MODAL_INFO_POKEMON = './../partials/pokemon/pokemonInfo.html';
	const PAGE_SIZE = 10;
	const LIMIT_POKEMONS_FOR_LIST = 10;

	/**
	 * Configuración del tablero
	 */
	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
		dataSrc: (data) => {
			data['data'] = data.results;
			$scope.pokemonsPage = data.results;
			data['recordsFiltered'] = data.count;
			data['recordsTotal'] = data.count;
			$scope.$applyAsync();
			// console.info('Datos a recibir: ', data);
			return data.results;
		},
		data: (data) => {
			data['offset'] = data.start;
			data['limit'] = data.length;
			// console.info('Datos a enviar: ', data);
			return data;
		},
		error: (e) => {
			console.error('Ocurrió un error al cargar los datos: ', e);
		},
		url: 'https://pokeapi.co/api/v2/pokemon/',
		type: 'GET',
	})
		.withOption('processing', true) //para mostrar el estado del progreso
		.withOption('serverSide', true) // para Server-Side Processing (Paginación de lado del servidor)
		.withOption('searching', false) // para ocultar el buscador (ya que el API no ofrece dicho servicio)
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
	 * Columnas de la tabla
	 */

	$scope.dtColumns = [
		//Agregamos .withOption('name','column_name') para enviar los nombres de las columnas al servidor
		DTColumnBuilder.newColumn('name', 'Nombre').withOption('name', 'name').notSortable(),
		DTColumnBuilder.newColumn(null, 'Seleccionar').notSortable()
			.renderWith((data, type, full, meta) => {
				let pokemon = searchPokemonInPokemonsList(data.name);
				let disabledCheck=($scope.pokemonsList.length>=LIMIT_POKEMONS_FOR_LIST && pokemon===null);
				let checkedPokemon=(pokemon !== null);
				return '<div class="text-center pokemon-checkbox"><label>' +
					'<input type="checkbox" name="" ng-disabled="'+disabledCheck+'" ng-checked="'+checkedPokemon+'"'+
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
	var searchPokemonInDatatable = function(nombrePokemon) {
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
		$(".pokemon-checkbox input").attr("disabled",false)
	};

	/**
	 * Agrega una pokemon a la lista de pokemones
	 * @param pokemonName
	 */
	$scope.addPokemonToPokemonsList = (pokemonName) => {
		console.log('Nombre del pokemon: ', pokemonName);
		let pokemon = searchPokemonInPokemonsList(pokemonName);
		if (pokemon) {
			removeElementFromPokemonsList(pokemonName);
		} else {

			if ($scope.pokemonsList.length < LIMIT_POKEMONS_FOR_LIST) {
				pokemon = searchPokemonInDatatable(pokemonName);
				$scope.pokemonsList.push(pokemon);
				if($scope.pokemonsList.length===LIMIT_POKEMONS_FOR_LIST){
					$(".pokemon-checkbox input").attr("disabled",true);
					/*$(".pokemon-checkbox input").each(function(index, elem) {
						console.log("elem: ",elem);
						console.log("elem: ",$(elem));
						console.log("elem: ",$(elem).val());
					});*/
				}else{
					$(".pokemon-checkbox [checked=true]").attr("disabled",false)
				}
			} else {
				console.warn('Ha llegado al limite de selección de pokemones');
			}
		}
	};

	/**
	 * Visualiza la lista de los pokemones seleccionados
	 */
	$scope.viewPokemonsList = () => {
		console.log('PokemonsList: ', $scope.pokemonsList);
		console.log('PokemonsPage: ', $scope.pokemonsPage);
		$rootScope.$emit('updatePokemonsList', $scope.pokemonsList);
		$('#selectedPokemonsModal').modal();
	};

	/**
	 * Visualiza la información de un pokemon en especifico
	 * @param pokemonName
	 * @returns {Promise<void>}
	 */
	$scope.viewPokemonInfo = async(pokemonName) => {
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