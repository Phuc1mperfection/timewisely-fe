import AppRoute from "./router/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner"
function App() {
  return (
    <>
      <Toaster  />
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
    </>
  );
}

export default App;
