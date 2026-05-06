import { createRouter } from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/history";
import { DefaultError } from "@/components/site/DefaultError";
import { routeTree } from "./routeTree.gen";

export const getRouter = (options?: { history?: RouterHistory }) => {
  const router = createRouter({
    routeTree,
    context: {},
    history: options?.history,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultError,
  });

  return router;
};
