import { useState,useEffect } from 'react'
import { useLocation } from "react-router-dom";
import Header from './components/header/header';
import Body from './components/body/body';
import './App.css';
import ProjektSide from './components/projekte-side/projekte-side';
import LandingPage from './components/landing-page/landing-page';
import Article from './components/article/article';
import AuthorProjects from './components/author-projects/author-projects';
import { Route,RouterProvider,createBrowserRouter, createRoutesFromElements } from 'react-router-dom';


const router = createBrowserRouter(createRoutesFromElements(
  

  <Route path="/" element={<Body/>}>
    
     <Route index element={<LandingPage />} />
     <Route path="/projekte" element={<ProjektSide/>}/>
     
     <Route path="/projekte/:article" element={<Article/>}/>
     <Route path="/projekte/:article/:author" element={<AuthorProjects/>}/>
  </Route>

));
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router}/>
      
    </>
  )
}

export default App
