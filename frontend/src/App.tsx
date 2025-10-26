
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
