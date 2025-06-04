import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AIProviders from "./components/providers/AIProviders";
import KnowledgeBase from "./components/knowledge/KnowledgeBase";
import WorkflowBuilder from "./components/workflow/WorkflowBuilder";
import WidgetGenerator from "./components/widgets/WidgetGenerator";
import DashboardLayout from "./components/layout/DashboardLayout";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            }
          />
          <Route
            path="/providers"
            element={
              <DashboardLayout>
                <AIProviders />
              </DashboardLayout>
            }
          />
          <Route
            path="/knowledge-base"
            element={
              <DashboardLayout>
                <KnowledgeBase />
              </DashboardLayout>
            }
          />
          <Route
            path="/workflows"
            element={
              <DashboardLayout>
                <WorkflowBuilder />
              </DashboardLayout>
            }
          />
          <Route
            path="/widgets"
            element={
              <DashboardLayout>
                <WidgetGenerator />
              </DashboardLayout>
            }
          />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
