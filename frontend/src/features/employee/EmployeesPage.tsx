import { Navigate, type RouteObject } from "react-router-dom";


export const EmployeeRoutes: RouteObject[] = [
    {
        index: true,
        element: <Navigate to="dashboard" replace />,
    },
    {
        path: 'dashboard',
        lazy: async () => {
            const module = await import('./pages/dashboard/DashboardPage');
            return { Component: module.default };
        },
    },
    {
        path: 'patients',
        lazy: async () => {
            const module = await import('./pages/patients/PatientsPage');
            return { Component: module.default };
        },
        children: [
            {
                index: true,
                lazy: async () => {
                    const module = await import('../../components/patients/PatientList');
                    return { Component: module.PatientsList };
                }
            },
            {
                path: ':patientId',
                lazy: async () => {
                    const module = await import('../../components/patients/PatientDetails');
                    return { Component: module.PatientDetails };
                }
            },
            {
                path: 'new',
                lazy: async () => {
                    const module = await import('../../components/patients/PatientForm');
                    return { Component: module.default };
                }
            },
            {
                path: 'edit',
                lazy: async () => {
                    const module = await import('../../components/patients/PatientForm');
                    return { Component: module.default };
                }
            },
            {
                path: 'medical-record/:patientId',
                lazy: async () => {
                    const module = await import('../../components/medical-record/MedicalPatientRecord');
                    return { Component: module.default};
                }
            }
        ]
    },
    {
        path:'at-risk-patients',
        lazy: async () => {
            const module = await import('./pages/at-risk-patients/AtRiskPatientPages');
            return { Component: module.default };
        }
    }
]
