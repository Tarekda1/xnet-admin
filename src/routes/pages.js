import { lazy } from "react";
import withSuspense from "../utilities/withSuspense";

export const NotFoundPage = withSuspense(
  lazy(() => import("../pages/NotFoundPage/NotFoundPage"))
);
