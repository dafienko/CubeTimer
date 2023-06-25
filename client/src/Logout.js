const Logout = () => {	
	const logout = () => {
		fetch(`${process.env.REACT_APP_API_ORIGIN}/logout`, {
			method: "GET",
			redirect: "follow",
			credentials: 'include'
		}).then((res) => {
			if (res.ok) {
				window.location.replace("/login");
			}
		}).catch((err) => {
			console.log(err);
		}).finally(() => {});	
	}

	return ( 
		<button className="default-button" onClick={logout}>Sign Out</button>
	);
};

export default Logout;