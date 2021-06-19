import './App.css';
// import AddHomeWork from './container/addHomework.component';
import Employee from './container/Employee.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <Switch>

      <Route exact path="/" component={Employee} />
    </Switch>

  );
}

export default App;
