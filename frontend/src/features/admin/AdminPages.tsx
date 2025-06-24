import type React from "react";
import { Navigate, type RouteObject } from "react-router-dom";



export const adminPlatformRoutes: RouteObject[] = [
     {
        index: true,
        element: <Navigate to="dashboard" replace />,
    },
    {
        path: 'dashboard',
        lazy: async () => {
            const module = await import('./pages/dashboard/dashboard');
            return { Component: module.default };
        }
    },
    {
        path: 'users',
        lazy: async () => {
            const module = await import('./pages/users/page');
            return { Component: module.default as React.ComponentType };
        },
        children:[
            {
                index: true,
                lazy: async () => {
                    const module = await import('./pages/users/list/page');
                    return { Component: module.AdminUsersList };
                }
            },
            {
                path: 'add',
                lazy: async () => {
                    const module = await import('./components/users/user-form');
                    return { Component: module.default };
                }
            },
            {
                path:'edit/',
                lazy: async () => {
                    const module = await import('./components/users/user-form');
                    return { Component: module.default };
                }
            },
            {
                path: 'profile/:userId',
                lazy: async () => {
                    const module = await import('./pages/users/profile/[id]/page');
                    return { Component: module.default };
                }
            },
            {
                path: 'permissions/:userId',
                lazy: async () => {
                    const module = await import('./pages/users/permissions/[id]/page');
                    return { Component: module.AdminUserPermissions };
                }
            },
            {
                path: 'roles',
                lazy: async () => {
                    const module = await import('./pages/users/roles/page');
                    return { Component: module.default };
                }
            }
        ]
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
                path: 'medical-record/:patientId',
                lazy: async () => {
                    const module = await import('../../components/medical-record/MedicalPatientRecord');
                    return { Component: module.default};
                }
            }
        ]
    },
]