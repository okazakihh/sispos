import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/login';
import ViewPrincipal from './Presentacion/ViewPrincipal';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/view-principal" element={<ViewPrincipal />} />
      </Routes>
    </Router>
  );
};

export default App;