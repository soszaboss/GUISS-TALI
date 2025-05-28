import { Navigate, type RouteObject } from "react-router-dom";



export const assistantRoutes: RouteObject[] = [
    {
        index: true,
        element: <Navigate to="dashboard" replace />,
    },
    {
        path: 'dashboard',
        lazy: async () => {
            const module = await import('./pages/dashboard/assistant-dashboard');
            return { Component: module.default };
        },
    },
    {
        path: 'patients',
        lazy: async () => {
            const module = await import('./pages/patients/page');
            return { Component: module.default };
        },
        children: [
            {
                index: true,
                lazy: async () => {
                    const module = await import('./components/patients/patients-list');
                    return { Component: module.PatientsList };
                }
            },
            {
                path: ':patientId',
                lazy: async () => {
                    const module = await import('./components/patients/patient-details');
                    return { Component: module.PatientDetails };
                }
            },
            {
                path: 'new',
                lazy: async () => {
                    const module = await import('./pages/patients/new/page');
                    return { Component: module.default };
                }
            },
            {
                path: 'edit/:patientId',
                lazy: async () => {
                    const module = await import('./pages/patients/edit/[id]/page');
                    return { Component: module.default };
                }
            },
            {
                path: 'delete/:patientId',
                element: <div>Delete Patient</div>
            },
            {
                path: 'medical-record/:patientId',
                lazy: async () => {
                    const module = await import('./components/patients/medical-record/patient-medical-record');
                    return { Component: module.PatientMedicalRecord };
                }
            },
            {
                path: ':patientId/add-new-vehicle',
                element: <div>Add New Vehicle</div>
            }
        ]
    }, 
    {
        path: 'notifications',
        lazy: async () => {
            const module = await import('./pages/notifications/page');
            return { Component: module.default };
        }
    },
    {
        path: 'appointments',
        lazy: async () => {
            const module = await import('./pages/appointments/page');
            return { Component: module.default };
        }
    }
]
