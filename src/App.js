import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </BrowserRouter>
  );
}

export default App;
