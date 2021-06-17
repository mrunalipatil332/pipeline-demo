import './App.css';
import AddHomeWork from './container/addHomework.component';

import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <Switch>

<Route exact path="/" component={AddHomeWork} />
    </Switch>
   
  );
}

export default App;
