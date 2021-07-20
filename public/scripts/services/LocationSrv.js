angular.module('LocationSrv', []).service('$locations', function($http) {
	const auth = 'test:auth'
	return {
		get: function(id) {
			if (id) {
				return $http.get(`/api/locations?id=${id}`, {
					headers: {
						withCredentials: true,
						authorization: `Basic ${auth}`
					}
				})
			} else {
				return $http.get('/api/locations', {
					headers: {
						withCredentials: true,
						authorization: `Basic ${auth}`
					}
				})
			}
		}
	}
})