import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import Home from './home';

function App() {
  return (
    <CookiesProvider>
      <Router>
        <div className="App">
          <div className="content">
            <Routes>
              <Route path="/login" element={ <Login/> } />
              <Route path="/" element={ <Home /> } />
            </Routes>
          </div>
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;