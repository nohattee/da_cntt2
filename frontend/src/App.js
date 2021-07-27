import { Switch, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ListNews from "./pages/ListNews";
import NewsDetail from "./pages/NewsDetail";
import SearchResult from "./pages/SearchResult";
import NavBar from './pages/components/Navigation';
import Error from './pages/components/ErrorMess';
import { AnimatePresence } from 'framer-motion';
import './App.css';

export default function App() {
  const location = useLocation();
  return (
    <div className="app">
      <NavBar />
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/" component={Home} />
          <Route path="/categories/:id" component={ListNews} />
          <Route path="/news/:id/" component={NewsDetail} />
          <Route path="/search/" component={SearchResult} />
          <Route path='*'>
            <Error />
          </Route>
        </Switch >
      </AnimatePresence>
    </div >
  )
}
