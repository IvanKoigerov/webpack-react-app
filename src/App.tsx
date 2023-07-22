import { createBrowserRouter, createRoutesFromElements, Route, Router, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index />
      <Route path="/data" />
      <Route path="/time" />
    </Route>,
  ),
);

const App = () => <RouterProvider router={router} />;

export default App;
