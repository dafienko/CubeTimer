import {useState, useEffect} from 'react'
import useFetch from './useFetch';

const useFetchJSON = (resource, options) => {
	const [data, setData] = useState(null);
	const {response, loading, error} = useFetch(resource, options);
	
	useEffect(() => {
		if (response && response.ok) {
			if (!response.bodyUsed) {
				response.json().then(data => {
					setData(data)
				}).catch(err => {
					setData(null);
				});
			}
		} else {
			setData(null);
		}
	}, [response]);

	return {
		data, 
		loading, 
		error
	};
};

export default useFetchJSON;

