import React from 'react';
import { Route, Switch } from 'wouter';
import GradientGenerator from './pages/GradientGenerator';
import NotFound from './pages/not-found';
import { ToastProvider } from './components/ToastProvider';

function Router() {
  return (
    <Switch>
      <Route path="/" component={GradientGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <ToastProvider />
    </>
  );
}

export default App;