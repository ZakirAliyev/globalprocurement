import './index.scss';
import { PulseLoader } from 'react-spinners';
import logo from "/public/assets/logo.png";

const Loader = ({ isVisible }) => {
    return (
        <section id="loader" className={`loader-wrapper ${isVisible ? 'show' : 'hide'}`}>
            <img src={logo} alt="Logo" className="logo" />
            <PulseLoader color="var(--bottom-nav-bg)" size={12} />
        </section>
    );
};

export default Loader;
