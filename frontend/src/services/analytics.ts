import type { DashboardApiResponse } from "@/types/analytics";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

function employeeAnalytics(): Promise<DashboardApiResponse> {
  console.log("API_URL =", API_URL);
  const url = API_URL && API_URL.endsWith("/") ? API_URL : (API_URL || "") + "/";
  console.log("Fetching employee analytics from:", url + "analytics/employee/");
  return axios.get(url + "analytics/employee/").then(res => res.data);
}

export { employeeAnalytics };