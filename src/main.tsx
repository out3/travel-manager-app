import React from 'react'
import ReactDOM from 'react-dom/client'
import TravelManager from '@/components/Travel/TravelManager.tsx'
import './index.css'
import {Toaster} from "@/components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TravelManager/>
        <Toaster/>
    </React.StrictMode>,
)
