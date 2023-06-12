import {useState, useEffect} from 'react'

const useFetch = (resource, options) => {
	options = options || {};

	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		if (!resource) {
			setResponse(null);
			return;
		}
		
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
			setLoading(false);
			setError(null);
			controller.abort();
		};
	}, [resource]); 

	return {
		response, 
		loading, 
		error
	};
};

export default useFetch;