import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Roles from './pages/Roles';
import RoleDetails from './pages/RoleDetails';
import Skills from './pages/Skills';
import Technologies from './pages/Technologies';
import Projects from './pages/Projects';
import GraphExplorer from './pages/GraphExplorer';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Roles */}
          <Route
            path="/roles"
            element={<Roles />}
          />

          {/* Role Details */}
          <Route
            path="/roles/:roleName"
            element={<RoleDetails />}
          />

          {/* Skills */}
          <Route
            path="/skills"
            element={<Skills />}
          />

          {/* Technologies */}
          <Route
            path="/technologies"
            element={<Technologies />}
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* Graph Explorer */}
          <Route
            path="/graph"
            element={<GraphExplorer />}
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;