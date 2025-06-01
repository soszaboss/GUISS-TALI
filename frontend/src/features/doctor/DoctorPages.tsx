import { Navigate, type RouteObject } from "react-router-dom";

export const doctorRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="dashboard" replace/>,
  },
  {
    path: "dashboard",
    lazy: async () => {
      const module = await import("./pages/dashboard/page");
      return { Component: module.default };
    },
  },
  {
    path: "consultations",
    lazy: async () => {
      const module = await import("./pages/consultations/page");
      return { Component: module.default };
    },
  },
  {
    path: "patients",
    lazy: async () => {
      const module = await import("./pages/patients/page");
      return { Component: module.default };
    }
  },
  {
    path: "medical-records/:patientId",
    lazy: async () => {
      const module = await import("./pages/medical-record/pages");
      return { Component: module.default};
    },
  },
  {
    path: "history",
    lazy: async () => {
      const module = await import("./pages/history/page");
      return { Component: module.default };
    },
  },
  {
    path: "risk-patients",
    lazy: async () => {
      const module = await import("./pages/risk-patients/page");
      return { Component: module.default };
    },
  },
  {
    path: "statistics",
    lazy: async () => {
      const module = await import("./pages/statistics/page");
      return { Component: module.default };
    },
  }
];