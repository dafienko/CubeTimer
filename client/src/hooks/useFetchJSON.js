import {useState, useEffect} from 'react'
import useFetch from './useFetch';

const useFetchJSON = (resource, options) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const {response, loading: responseLoading, error} = useFetch(resource, options);

	useEffect(() => {
		if (responseLoading) {
			setLoading(true);
		}
	}, [responseLoading])

	useEffect(() => {
		if (response && response.ok) {
			if (!response.bodyUsed) {
				response.json().then(data => {
					setData(data);
				}).catch(err => {
					setData(null);
				}).finally(() => {
					setLoading(false);
				});
			}
		} else {
			setData(null);
			setLoading(responseLoading);
		}
	}, [response]);

	return {
		data, 
		loading, 
		error
	};
};

export default useFetchJSON;

