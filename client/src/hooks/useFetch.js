import {useState, useEffect} from 'react'

const useFetch = (resource, options) => {
	options = options || {};

	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(resource && true);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		setLoading(resource && true);

		if (!resource) {
			return;
		}
		
		const controller = new AbortController();
		options.signal = controller.signal;

		fetch(resource, options).then((response) => {
			setResponse(response);
			setLoading(false);
		}).catch((err) => {
			setError(err);
			setLoading(false);
		});

		return () => {
			setLoading(false);
			setResponse(null);
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