// React
import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider,} from "react-router-dom";
// Routes
import ErrorPage from "@/error-page.tsx";
import Root from '@/routes/root.tsx';
import Dashboard from "@/routes/dashboard.tsx";
import Transactions from "@/routes/transactions.tsx";
// UI
import {Toaster} from "@/components/ui/toaster.tsx";
// CSS
import './index.css'


// App router
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root/>} errorElement={<ErrorPage/>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/transactions" element={<Transactions/>}/>
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
        <Toaster/>
    </React.StrictMode>,
)
