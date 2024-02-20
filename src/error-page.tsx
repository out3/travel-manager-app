import {Link, useNavigate} from 'react-router-dom';
import {Button} from "@/components/ui/button.tsx";


type BugIconProps = {
    className?: string
}

function BugIcon(props: BugIconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 2 1.88 1.88" />
            <path d="M14.12 3.88 16 2" />
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
            <path d="M12 20v-9" />
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
            <path d="M6 13H2" />
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
            <path d="M22 13h-4" />
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        </svg>
    )
}

function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[400px] gap-2 text-center">
            <div className="flex items-center justify-center rounded-full p-6 bg-gray-100 dark:bg-gray-800">
                <BugIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Uh oh! Something went wrong.</h1>
                <p className="text-gray-500 dark:text-gray-400">Don't worry, we're on it.</p>
            </div>
            <Button
                onClick={() => navigate(-1)}
                className="mt-4"
            >
                Go back
            </Button>
            <Link to={"/"}>Home</Link>
        </div>

)
}
export default ErrorPage
