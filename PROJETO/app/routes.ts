import { createBrowserRouter } from "react-router";
import { MainExperience } from "./components/MainExperience";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainExperience,
  },
  {
    path: "*",
    Component: MainExperience,
  },
]);
