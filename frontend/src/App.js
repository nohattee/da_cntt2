import {
  Switch,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import NewsDetail from "./pages/NewsDetail";


export default function App() {
  return (
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/news/:id">
          <NewsDetail />
        </Route>
      </Switch>
  )
}
