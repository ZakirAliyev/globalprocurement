import "./index.scss";
import { useState, useRef, useEffect } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";

export default function BottomNavbar() {
    const [openMega, setOpenMega] = useState(false);
    const navRef = useRef(null);

    const data = [
        {
            name: "İnşaat materialları",
            icon: "🏗️",
            sub: [
                {
                    title: "Alçı, suvaq və materialları",
                    items: ["Dart dolğular", "İzolyasiya materialları", "Köməkçi vasitələr", "Məlhəmlər"],
                },
                {
                    title: "Laminantlar",
                    items: ["AGT", "Kronostar", "Digər"],
                },
                {
                    title: "Silikonlar, mastiklər, köpüklər",
                    items: ["Köpüklər", "Köpük-silikon tapancalar", "Silikonlar və mastiklər"],
                },
            ],
        },
        { name: "İşıqlandırma", icon: "💡" },
        { name: "İstilik və Havalandırma", icon: "🔥" },
        { name: "Boya məhsulları", icon: "🎨" },
        { name: "Seramika və Santexnika", icon: "🚿" },
        { name: "Məişət texnikası", icon: "📺" },
        { name: "Xırdavat və alətlər", icon: "🔧" },
        { name: "Bağ və ev əşyaları", icon: "🌳" },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) setOpenMega(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section id="bottomNavbar" ref={navRef}>
            <div className="container">
                <nav>
                    <button
                        className={`cat-trigger ${openMega ? "active" : ""}`}
                        onClick={() => setOpenMega((v) => !v)}
                    >
                        <BiCategoryAlt className="icon" />
                        <span>Bütün kateqoriyalar</span>
                        <IoChevronDown className={`chev ${openMega ? "rot" : ""}`} />
                    </button>

                    <div className="number">
                        <span className="selected">Ana səhifə</span>
                        <span>Endirimlər</span>
                        <span>Haqqımızda</span>
                    </div>
                </nav>

                {/*{openMega && (*/}
                {/*    <div className="mega-panel">*/}
                {/*        <div className="left">*/}
                {/*            {data.map((cat, idx) => (*/}
                {/*                <div key={idx} className="category">*/}
                {/*                    <span>{cat.icon}</span> {cat.name}*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}

                {/*        <div className="right">*/}
                {/*            {data[0].sub.map((group, gIdx) => (*/}
                {/*                <div key={gIdx} className="column">*/}
                {/*                    <h4>{group.title}</h4>*/}
                {/*                    <ul>*/}
                {/*                        {group.items.map((item, iIdx) => (*/}
                {/*                            <li key={iIdx}>{item}</li>*/}
                {/*                        ))}*/}
                {/*                    </ul>*/}
                {/*                </div>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </section>
    );
}
