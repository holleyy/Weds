import { createHashRouter } from "react-router";
import { AuthPage } from "./components/AuthPage";
import { HomePage } from "./components/HomePage";
import { BallotPage } from "./components/BallotPage";
import { ViewBallotsPage } from "./components/ViewBallotsPage";
import { StatsPage } from "./components/StatsPage";
import { FilmLogPage } from "./components/FilmLogPage";
import { AdminPage } from "./components/AdminPage";
import { Layout } from "./components/Layout";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: AuthPage },
      { path: "home", Component: HomePage },
      { path: "ballot", Component: BallotPage },
      { path: "view-ballots", Component: ViewBallotsPage },
      { path: "stats", Component: StatsPage },
      { path: "film-log", Component: FilmLogPage },
      { path: "admin", Component: AdminPage },
    ],
  },
]);