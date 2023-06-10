import {useState, useEffect} from 'react'

const useFetch = (resource, options) => {
	options = options || {};

	const [data, setResponse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		const controller = new AbortController();
		options.signal = controller.signal;

		fetch(resource, options).then((response) => {
			if (response.ok) {
				return response.json();
			}
		}).then((d) => {
			setResponse(d);
		}).catch((err) => {
			setError(err);
		}).finally(() => {
			setLoading(false);
		});

		return () => {
			controller.abort();
		};
	}, [resource]);

	return {
		data, 
		loading, 
		error
	};
};

export default useFetch;