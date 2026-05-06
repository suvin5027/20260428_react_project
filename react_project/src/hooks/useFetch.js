import { useState, useEffect } from 'react';
import instance from '../api/instance';

// API 호출 공통 훅
function useFetch(url) {
	const [data, setData]	= useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!url) return;

		const fetchData = async () => {
			setIsLoading(true);
			try {
				const res = await instance.get(url);
				setData(res.data);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, isLoading, error };
}

export default useFetch;
