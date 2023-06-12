import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';
import Profile from './profile';

function App() {
  return (
    <CookiesProvider>
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
    </CookiesProvider>
  );
}

export default App;