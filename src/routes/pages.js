import { lazy } from "react";
import withSuspense from "../utilities/withSuspense";

export const NotFoundPage = withSuspense(
  lazy(() => import("../pages/NotFoundPage/NotFoundPage"))
);

export const Subscribers = withSuspense(
  lazy(() => import("../pages/admin/subscribers"))
);

export const ImportUsers = withSuspense(
  lazy(() => import("../pages/admin/subscribers/ImportUsers"))
);

export const Expenses = withSuspense(
  lazy(() => import("../pages/admin/expenses"))
);

export const Login = withSuspense(lazy(() => import("../pages/account/Login")));

export const Register = withSuspense(
  lazy(() => import("../pages/account/Register"))
);

export const VerifyEmail = withSuspense(
  lazy(() => import("../pages/account/VerifyEmail"))
);

export const ForgotPassword = withSuspense(
  lazy(() => import("../pages/account/ForgotPassword"))
);

export const ResetPassword = withSuspense(
  lazy(() => import("../pages/account/ResetPassword"))
);

export const AddEdit = withSuspense(
  lazy(() => import("../pages/admin/users/AddEdit"))
);

export const ListUsers = withSuspense(
  lazy(() => import("../pages/admin/users/List"))
);

export const Plans = withSuspense(
  lazy(() => import("../pages/billing/plans/plans"))
);

export const Dashboard = withSuspense(lazy(() => import("../pages/dashboard")));

export const Users = withSuspense(lazy(() => import("../pages/admin/users")));
