import "../css/NavBar.css";
import { Karla } from "next/font/google";
import Image from "next/image";

//Load Karla Font
const karla = Karla({ subsets:["latin"], weight:["700"] });

export default function NavBar() {
    return (
        <nav className="navBar">
            <div className="container">
                <a className="logo">
                    <Image src="/restaurantLogo.png" alt="logo" width={150} height={150} />
                </a>
                
                <ul className="navLinks">
                    <li><a>HOME</a></li>
                    <li><a>MENU</a></li>
                    <li><a>ORDER</a></li>
                    <li><a>LOGIN</a></li>
                </ul>

                
            </div>
            <div className="thinLine"></div>
            <div className="whiteSpace"></div>
            <div className="thickLine"></div>
        </nav>
    );
}