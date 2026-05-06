import { RouterProvider } from "@tanstack/react-router";
import { createHashHistory } from "@tanstack/history";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter({
  history: createHashHistory(),
});

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(<RouterProvider router={router} />);
