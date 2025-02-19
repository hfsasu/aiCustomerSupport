import "../css/NavBar.css";

export default function NavBar() {
    return (
        <nav className="navBar">
            <div className="container">
                <a className="logo">In-n-Out</a>
                
                <ul className="navLinks">
                    <li><a>Home</a></li>
                    <li><a>Menu</a></li>
                    <li><a>Support</a></li>
                </ul>
            </div>
        </nav>
    );
}