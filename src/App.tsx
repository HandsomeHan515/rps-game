import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Game from './pages/Game';
import Room from './pages/Room';
import NotFound from './pages/NotFund';

function App () {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/game" element={<Game />} />
          <Route path="/" element={<Navigate to="/game" replace />} />
          <Route path='/room/:roomId/user/:userId' element={<Room />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
