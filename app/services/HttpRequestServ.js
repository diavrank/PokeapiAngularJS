pokeapiApp.service('HttpRequestServ', function($http, $q) {

	let self = this;

	/**
	 * Ejecutar una petición tipo GET.
	 * @param URL
	 * @returns {*}
	 */
	self.getRequest = function(URL) {
		let deferred = $q.defer();
		$http.get(URL).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * Ejecutar una petición tipo POST MultipartFormData.
	 * @param URL
	 * @param data
	 * @returns {*}
	 */
	self.postXRequest = function(URL, data) {
		let deferred = $q.defer();
		$http.post(URL, data, {
			headers: {
				'Content-type': undefined,
			},
			transformRequest: angular.identity,

		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * Ejecutar una petición de tipo PUT MultipartFormData.
	 * @param URL
	 * @param data
	 * @returns {*}
	 */
	self.putXRequest = function(URL, data) {
		let deferred = $q.defer();
		$http.post(URL, data, {
			headers: {
				'Content-type': undefined,
			},
			transformRequest: angular.identity,

		}).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * Ejecutar una petición tipo POST.
	 * @param URL
	 * @param data
	 * @returns {*}
	 */
	self.postRequest = function(URL, data) {
		let deferred = $q.defer();
		$http.post(URL, data).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * Ejecutar una petición de tipo PUT.
	 * @param URL
	 * @param data
	 * @returns {*}
	 */
	self.putRequest = function(URL, data) {
		let deferred = $q.defer();
		$http.put(URL, data).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * Ejecutar una petición de tipo PATCH.
	 * @param URL
	 * @param data
	 * @returns {Promise}
	 */
	self.patchRequest = function(URL, data) {
		let deferred = $q.defer();
		$http.patch(URL, data).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * Ejecutar una petición tipo DELETE.
	 * @param URL
	 * @returns {*}
	 */
	self.deleteRequest = function(URL) {
		let deferred = $q.defer();
		$http.delete(URL).then(function(response) {
			deferred.resolve(response.data);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

});
