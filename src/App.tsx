import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AIProviders from "./components/providers/AIProviders";
import KnowledgeBase from "./components/knowledge/KnowledgeBase";
import WorkflowBuilder from "./components/workflow/WorkflowBuilder";
import WidgetGenerator from "./components/widgets/WidgetGenerator";
import ExternalAPIs from "./components/apis/ExternalAPIs";
import PromptTemplates from "./components/prompts/PromptTemplates";
import Analytics from "./components/analytics/Analytics";
import UsersRoles from "./components/users/UsersRoles";
import Billing from "./components/billing/Billing";
import Settings from "./components/settings/Settings";
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
          <Route path="/widgets" element={<WidgetGenerator />} />
          <Route
            path="/apis"
            element={
              <DashboardLayout>
                <ExternalAPIs />
              </DashboardLayout>
            }
          />
          <Route
            path="/prompts"
            element={
              <DashboardLayout>
                <PromptTemplates />
              </DashboardLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            }
          />
          <Route
            path="/users"
            element={
              <DashboardLayout>
                <UsersRoles />
              </DashboardLayout>
            }
          />
          <Route
            path="/billing"
            element={
              <DashboardLayout>
                <Billing />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
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
