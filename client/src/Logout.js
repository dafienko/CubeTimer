const Logout = () => {	
	const logout = () => {
		fetch("http://localhost:9000/logout", {
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
		<button className="logout" onClick={logout}>Sign Out</button>
	);
};

export default Logout;