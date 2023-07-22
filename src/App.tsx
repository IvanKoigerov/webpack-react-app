import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './normalize.css';

import Data from '@app/pages/Data/Data';
import Home from '@app/pages/Home/Home';
import Images from '@app/pages/Images/Images';
import Time from '@app/pages/Time/Time';

const App = () => (
  <BrowserRouter basename={process.env.BASE_PATH ?? '/'}>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/data" element={<Data />} />
      <Route path="/time" element={<Time />} />
      <Route path="/images" element={<Images />} />
    </Routes>
  </BrowserRouter>
);

export default App;
