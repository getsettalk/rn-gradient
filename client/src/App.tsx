import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import GradientGenerator from "@/pages/GradientGenerator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={GradientGenerator} />
      <Route path="/about" component={GradientGenerator} />
      <Route path="/features" component={GradientGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>

  );
}

export default App;
