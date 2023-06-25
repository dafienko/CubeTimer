import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Profile from './profile';
import { UserProvider } from './User';

import './index.css';
import Settings from './profile/settings';
import Solves from './profile/solves';
import { ColorThemeProvider } from './ColorTheme';

function App() {
  return (
    <CookiesProvider>
      <UserProvider>
		<ColorThemeProvider>
			<Router>
				<div className="App">
					<div className="content">
						<Routes>
							<Route path="/login" element={ <Login/> } />
							<Route path="/" element={ <Home /> } />
							<Route path="/profile" element={ <Profile /> }>
								<Route index element={<Navigate to="/profile/solves" />} />
								<Route path="/profile/solves" element={ <Solves /> }/>
								<Route path="/profile/settings" element={ <Settings /> }/>
							</Route>
						</Routes>
					</div>
				</div>
			</Router>
		</ColorThemeProvider>
      </UserProvider>
    </CookiesProvider>
  );
}

export default App;