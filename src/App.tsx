import AppRoute from "./router/AppRoute";
import { AuthProvider } from "./context/AuthContext";
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
