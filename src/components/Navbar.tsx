import {NavLink} from "react-router-dom";

function Navbar() {
    const routes = [
        {path: "/dashboard", label: "Dashboard"},
        {path: "/transactions", label: "Transactions"}
    ];


    return (
        <>
            <div className="bg-gray-100 rounded-lg shadow px-1 py-1 flex space-x-2">
                {routes.map((route) => (
                    <NavLink end to={route.path} key={route.label} className={({ isActive}) =>
                        [
                            "h-9 px-5 py-2",
                            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            isActive ? "bg-primary text-primary-foreground" : ""
                        ].join(" ")}
                    >
                        {route.label}
                    </NavLink>
                ))}
            </div>
        </>
    )
}

export default Navbar
