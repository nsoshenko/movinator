import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/question">
          <p>Question screen</p>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
