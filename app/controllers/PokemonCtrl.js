pokeapiApp.controller('PokemonCtrl', function($scope, $compile, DTOptionsBuilder, DTColumnBuilder) {

	/**
	 * Atributos
	 */
	$scope.dtInstance = {};
	$scope.pokemonsPage = [];
	$scope.pokemonsList = [];
	const PAGE_SIZE = 10;

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
		DTColumnBuilder.newColumn(null, 'Seleccionar').withOption('name', 'url').notSortable()
			.renderWith((data, type, full, meta) => {
				let pokemon=searchPokemonInPokemonsList(data.name);
				return '<div class="text-center"><label>' +
					'<input type="checkbox" name="" ng-checked="'+(pokemon!==null)+'" ng-click="addPokemonToPokemonsList(' + '\'' + data.name + '\'' + ')">' +
					'</label></div>';
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
	 * @param nombrePokemon
	 * @return Regresa el objeto del pokemon
	 */
	var searchPokemonInPokemonsList = (nombrePokemon) => {
		let pokemon = null;
		for (let pokemonTemp of $scope.pokemonsList) {
			if (nombrePokemon == pokemonTemp.name) {
				pokemon = pokemonTemp;
				break;
			}
		}
		return pokemon;
	};

	/**
	 * Remueve un elemento de la lista de pokemones seleccionados
	 * @param nombrePokemon
	 */
	var removeElementFromPokemonsList = (nombrePokemon) => {
		let indexPokemon = null;
		$scope.pokemonsList.some((pokemonTemp, index) => {
			if (pokemonTemp.name == nombrePokemon) {
				indexPokemon = index;
				return;
			}
		});
		$scope.pokemonsList.splice(indexPokemon, 1);
	};

	/**
	 * Agrega una pokemon a la lista de pokemones
	 * @param nombrePokemon
	 */
	$scope.addPokemonToPokemonsList = (nombrePokemon) => {
		console.log('Nombre del pokemon: ', nombrePokemon);
		let pokemon = searchPokemonInPokemonsList(nombrePokemon);
		if (pokemon) {
			removeElementFromPokemonsList(nombrePokemon);
		} else {
			pokemon = searchPokemonInDatatable(nombrePokemon);
			$scope.pokemonsList.push(pokemon);
		}
	};


	$scope.viewPokemonsList=()=>{
		console.log("PokemonsList: ",$scope.pokemonsList);
		console.log("PokemonsPage: ",$scope.pokemonsPage);
	}

});