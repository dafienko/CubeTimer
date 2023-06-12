import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Profile from './profile';
import { UserProvider } from './User';

import './index.css';

function App() {
  return (
    <CookiesProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <div className="content">
              <Routes>
                <Route path="/login" element={ <Login/> } />
                <Route path="/" element={ <Home /> } />
                <Route path="/profile" element={ <Profile /> } />
              </Routes>
            </div>
          </div>
        </Router>
      </UserProvider>
    </CookiesProvider>
  );
}

export default App;