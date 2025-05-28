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
                    const module = await import('./components/users/users-list');
                    return { Component: module.AdminUsersList };
                }
            },
            {
                path: 'add',
                lazy: async () => {
                    const module = await import('./pages/users/add/page');
                    return { Component: module.default };
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
        path: 'settings',
        lazy: async () => {
            const module = await import('./pages/settings/global/page');
            return { Component: module.default };
        }
    },
    {
        path: 'logs',
        lazy: async () => {
            const module = await import('./pages/logs/page');
            return { Component: module.default };
        }
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
                    return { Component: module.default };
                }
            },
            {
                path: ':patientId',
                lazy: async () => {
                    const module = await import('./components/patients/patient-detail');
                    return { Component: module.default };
                }
            }
        ]
    },
    {
        path: 'medical-records',
        lazy: async () => {
            const module = await import('./pages/medical-records/page');
            return { Component: module.default };
        },
        children:[
            {
                index: true,
                lazy: async () => {
                    const module = await import('./components/medical-records/medical-records-list');
                    return { Component: module.default };
                }
            },
            {
                path: ':recordId',
                lazy: async () => {
                    const module = await import('./pages/medical-records/[id]/page');
                    return { Component: module.default as React.ComponentType };
                }
            },
        ]
    }
]