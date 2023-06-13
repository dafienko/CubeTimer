import {useState, useEffect} from 'react'
import useFetch from './useFetch';

const useFetchJSON = (resource, options) => {
	const {response, loading: responseLoading, error} = useFetch(resource, options);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(responseLoading);

	useEffect(() => {
		if (responseLoading) {
			setLoading(true);
		}
	}, [responseLoading]);

	useEffect(() => {
		if (!resource) {
			setLoading(false);
		}
	}, [resource]);

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

