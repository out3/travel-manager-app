import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

function Navbar() {
    const routes = [
        {path: "/dashboard/", label: "Dashboard"},
        {path: "/transactions/", label: "Transactions"}
    ];

    return (
        <>
            <div className="bg-gray-100 rounded-lg shadow px-1 py-1 flex space-x-2">
                {routes.map((route) => (
                    <Link to={route.path} key={route.label}>
                        <Button
                            className="text-gray-600 font-semibold rounded hover:bg-gray-100"
                            variant="ghost">
                            {route.label}
                        </Button>
                    </Link>
                ))}
            </div>
            {/*<Link to={travelId + "/dashboard"}>*/}
            {/*    <Button*/}
            {/*        className="bg-primary text-white px-5 font-semibold shadow rounded hover:shadow-none hover:bg-primary-foreground"*/}
            {/*        variant="ghost">*/}
            {/*        Dashboard*/}
            {/*    </Button>*/}
            {/*</Link>*/}
            {/*<Link to={travelId + "/transactions"}>*/}
            {/*    <Button*/}
            {/*        className="text-gray-600 font-semibold rounded hover:bg-gray-100"*/}
            {/*        variant="ghost">*/}
            {/*        Transactions*/}
            {/*    </Button>*/}
            {/*</Link>*/}
        </>
    )
}

export default Navbar
