import { BrowserRouter } from "react-router-dom";
import { AppDataProvider } from "./providers/AppDataProvider";
import { AppRouter } from "./router";

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppDataProvider>
  );
}
