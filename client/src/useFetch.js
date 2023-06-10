import {useState, useEffect} from 'react'

const useFetch = (resource, options) => {
	options = options || {};

	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		const controller = new AbortController();
		options.signal = controller.signal;

		fetch(resource, options).then((response) => {
			setResponse(response);
		}).catch((err) => {
			setError(err);
		}).finally(() => {
			setLoading(false);
		});

		return () => {
			controller.abort();
		};
	}, []);

	return {
		response, 
		loading, 
		error
	};
};

export default useFetch;