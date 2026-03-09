
import Body from './components/body/body';
import './App.css';
import ProjektSide from './components/projekte-side/projekte-side';
import LandingPage from './components/landing-page/landing-page';
import Article from './components/article/article';
import AuthorProjects from './components/author-projects/author-projects';
import CreateBlog from './components/createBlog/createBlog';
import { Route,RouterProvider,createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LoginSide from './components/login/login';
import RegisterSide from './components/register/register';
import Dashboard from './components/dashboard/dashboard';
import AdminPortal from './components/adminPortal/adminPortal';

import Nutzung from './components/nutzung/nutzung';
import Datenschutz from './components/datenschutz/datenschutz';
import ResetPassword from './components/passwort-vergessen/passwort-vergessen';
import EditProfile from './components/editProfile/editProfile';



const router = createBrowserRouter(createRoutesFromElements(
  

  <Route path="/" element={<Body/>}>
    
     <Route index element={<LandingPage />} />
     <Route path="/projekte" element={<ProjektSide/>}/>
     
     <Route path="/projekte/:article" element={<Article/>}/>
     <Route path="/projekte/:article/:author" element={<AuthorProjects/>}/>
     <Route path="/login" element={<LoginSide/>}/>
     <Route path="/register" element={<RegisterSide/>}/>
     <Route path="/dashboard/create" element={<CreateBlog/>}/>
     <Route path="/dashboard/edit/:article" element={<CreateBlog/>}/>
     <Route path="/dashboard" element={<Dashboard/>}/>
     <Route path="/admin" element={<AdminPortal></AdminPortal>}/>
     <Route path="/impressum-datenschutz" element={<Datenschutz></Datenschutz>}/>
     <Route path="/nutzungsbedingungen" element={<Nutzung></Nutzung>}/>
     <Route path="/passwort-vergessen" element={<ResetPassword></ResetPassword>}/>
     <Route path="/edit-profile" element={<EditProfile></EditProfile>}/>
  </Route>

));
function App() {


  return (
    <>
      <RouterProvider router={router}/>
      
    </>
  )
}

export default App
