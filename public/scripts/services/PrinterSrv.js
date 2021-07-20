angular.module('PrinterSrv', []).service('$printers', function($http) {
	/*
	 TODO: Do I make this the main API caller? Or do I make a separate service for API calls
	        and use that as the main one while including this and the locations service?
	 */

	const auth = 'test:auth' // $api.getAuth();
	return {
		get: function(id) {
			if (id) {
				return $http.get(`/api/printers?id=${id}`, {
					headers: {
						withCredentials: true,
						authorization: `Basic ${auth}`
					}
				})
			} else {
				return $http.get('/api/printers', {
					headers: {
						withCredentials: true,
						authorization: `Basic ${auth}`
					}
				})
			}
		}
	}
})