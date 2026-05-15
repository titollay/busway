import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import Chart from 'react-apexcharts';

const EyeTracking = ({ isDark }) => {
    return (
        <StyledEyeWrapper $isDark={isDark}>
            <div className="btn-container">
                <div style={{ "--a": 0 }} className="btn-sensor sensor-n" />
                <div style={{ "--a": 45 }} className="btn-sensor sensor-ne" />
                <div style={{ "--a": 90 }} className="btn-sensor sensor-e" />
                <div style={{ "--a": 135 }} className="btn-sensor sensor-se" />
                <div style={{ "--a": 180 }} className="btn-sensor sensor-s" />
                <div style={{ "--a": 225 }} className="btn-sensor sensor-sw" />
                <div style={{ "--a": 270 }} className="btn-sensor sensor-w" />
                <div style={{ "--a": 315 }} className="btn-sensor sensor-nw" />
                <div className="eyes-row">
                    <button className="btn-button" type="button">
                        <div className="btn-pupil">
                            <div className="pupil-glint" />
                        </div>
                        <div className="btn-lid top-lid" />
                        <div className="btn-lid bottom-lid" />
                    </button>
                    <button className="btn-button" type="button">
                        <div className="btn-pupil">
                            <div className="pupil-glint" />
                        </div>
                        <div className="btn-lid top-lid" />
                        <div className="btn-lid bottom-lid" />
                    </button>
                </div>
            </div>
        </StyledEyeWrapper>
    );
};

const StyledEyeWrapper = styled.div`
  .btn-container {
    --pupil-color: #2563eb;
    --pupil-dark: #1e3a8a;
    --eye-bg: #ffffff;
    --bg-color: ${props => props.$isDark ? '#0a0a0a' : '#f4f6fa'};
    --eye-border: ${props => props.$isDark ? '#334155' : '#e2e8f0'};
    --pupil-move: 15%;
    --sensor-height: 100dvmax;
    --sensor-width: calc(var(--sensor-height) * 82.84 / 100);
    
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform: scale(0.5); /* Scaled properly for the dashboard */
    width: 140px;
    height: 60px;
    overflow: visible;
  }

  .btn-sensor {
    clip-path: polygon(0 0, 100% 0, 50% 100%, 0 0);
    height: var(--sensor-height);
    left: calc(50% - var(--sensor-width) / 2);
    position: absolute;
    top: calc(50% - var(--sensor-height) / 2);
    transform: rotate(calc(var(--a) * 1deg)) translateY(calc(var(--sensor-height) * -50 / 100));
    width: var(--sensor-width);
    z-index: 99;
    pointer-events: auto;
  }

  .eyes-row {
    display: flex;
    gap: 20px;
    position: relative;
    z-index: 100;
    pointer-events: none;
  }

  .btn-button {
    background: var(--eye-bg);
    border: 3px solid #1e293b;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    pointer-events: auto; /* Allow hovering on the eye itself */
    box-shadow: 
      inset 0 8px 16px rgba(0,0,0,0.1), 
      inset 0 -4px 8px rgba(0,0,0,0.05),
      0 6px 12px rgba(0,0,0,0.1),
      0 0 0 4px var(--eye-border);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-button:active {
    transform: scale(0.95);
  }

  .btn-pupil {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--pupil-color) 0%, var(--pupil-dark) 100%);
    border: 5px solid #0f172a;
    border-radius: 50%;
    position: absolute;
    transition: transform 0.15s cubic-bezier(0.2, 0, 0.4, 1);
    transform: translate(0, 0);
    box-shadow: 0 3px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  /* Glossy light reflection on pupil */
  .pupil-glint {
    margin-top: 4px;
    margin-left: 4px;
    width: 8px;
    height: 8px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(255,255,255,0.9);
  }
  
  .pupil-glint::after {
    content: '';
    position: absolute;
    top: 14px;
    left: 14px;
    width: 4px;
    height: 4px;
    background: #ffffff;
    border-radius: 50%;
    opacity: 0.6;
  }

  /* Physical Eyelids */
  .btn-lid {
    position: absolute;
    width: 120%;
    height: 65%;
    background: var(--bg-color);
    z-index: 101;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .top-lid {
    top: -10%;
    left: -10%;
    transform: translateY(-100%);
    border-bottom: 3.5px solid #1e293b;
    border-radius: 0 0 50% 50% / 0 0 30% 30%;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .bottom-lid {
    bottom: -10%;
    left: -10%;
    transform: translateY(100%);
    border-top: 3.5px solid #1e293b;
    border-radius: 50% 50% 0 0 / 30% 30% 0 0;
    box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
  }

  /* Squint on hover */
  .btn-button:hover .top-lid {
    transform: translateY(-50%);
  }
  .btn-button:hover .bottom-lid {
    transform: translateY(60%);
  }

  /* Blink on active/click */
  .btn-button:active .top-lid {
    transform: translateY(-5%);
  }
  .btn-button:active .bottom-lid {
    transform: translateY(5%);
  }

  /* Routing sensor hovers to pupil tracking */
  .sensor-n:hover ~ .eyes-row .btn-button .btn-pupil { transform: translateY(calc(-3 * var(--pupil-move))); }
  .sensor-ne:hover ~ .eyes-row .btn-button .btn-pupil { transform: translate(calc(2 * var(--pupil-move)), calc(-2 * var(--pupil-move))); }
  .sensor-e:hover ~ .eyes-row .btn-button .btn-pupil { transform: translateX(calc(3 * var(--pupil-move))); }
  .sensor-se:hover ~ .eyes-row .btn-button .btn-pupil { transform: translate(calc(2 * var(--pupil-move)), calc(2 * var(--pupil-move))); }
  .sensor-s:hover ~ .eyes-row .btn-button .btn-pupil { transform: translateY(calc(3 * var(--pupil-move))); }
  .sensor-sw:hover ~ .eyes-row .btn-button .btn-pupil { transform: translate(calc(-2 * var(--pupil-move)), calc(2 * var(--pupil-move))); }
  .sensor-w:hover ~ .eyes-row .btn-button .btn-pupil { transform: translateX(calc(-3 * var(--pupil-move))); }
  .sensor-nw:hover ~ .eyes-row .btn-button .btn-pupil { transform: translate(calc(-2 * var(--pupil-move)), calc(-2 * var(--pupil-move))); }
`;
const FleetActionButton = ({ onClick, isDark }) => {
  return (
    <StyledHammerWrapper $isDark={isDark}>
      <button onClick={onClick} className="button" data-text="&nbsp;CARTE DU SYSTÈME&nbsp;">
        &nbsp;CARTE DU SYSTÈME&nbsp;
      </button>
    </StyledHammerWrapper>
  );
};

const StyledHammerWrapper = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  /* button styling */
  .button {
    --border-right: 6px;
    --text-stroke-color: ${props => props.$isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)"};
    --animation-color: #3b82f6; /* Blue theme color to match dashboard */
    --fs-size: 1.5em; /* Adjusted size slightly for the header */
    
    margin: 0;
    padding: 0;
    height: auto;
    background: transparent;
    border: none;
    cursor: pointer;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: inherit;
    font-weight: 800;
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
    white-space: nowrap;
  }
  
  /* this is the text, when you hover on button */
  .button::before {
    content: attr(data-text);
    position: absolute;
    box-sizing: border-box;
    color: var(--animation-color);
    width: 0%;
    top: 0;
    left: 0;
    bottom: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: width 0.5s ease-out, filter 0.5s ease-out, border-right-color 0.5s ease-out;
    -webkit-text-stroke: 1px var(--animation-color);
    text-align: left;
  }
  
  /* hover */
  .button:hover::before {
    width: 100%;
    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.6));
    border-right-color: transparent; /* optionally hide the bar at the very end */
  }
`;

const StatCard = ({ icon, label, val, color, trend, subtext, isDark }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const [period, setPeriod] = useState("Total");
    const periods = ["Total", "Aujourd'hui", "Hebdomadaire"];

    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [open]);

    return (
        <motion.div 
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.1)" }}
            style={{ 
                background: isDark ? "#111827" : "#ffffff", 
                padding: "24px 28px", 
                borderRadius: "32px", 
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)", 
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.05)",
                display: "flex", 
                gap: "20px", 
                alignItems: "center", 
                position: "relative",
                cursor: "pointer",
                zIndex: open ? 50 : 1,
                minHeight: "160px",
                height: "100%"
            }}
        >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden", borderRadius: "32px" }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0.1 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: "easeOut" }}
                        style={{ position: "absolute", left: "-10%", top: "50%", transform: "translateY(-50%)", width: 150, height: 150, borderRadius: "50%", backgroundColor: color }}
                    />
                ))}
            </div>

            <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: "20px", 
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.03)"
            }}>
                <i className={`fa-solid ${icon}`} style={{ fontSize: "1.8rem", color: color }}></i>
            </div>

            <div style={{ zIndex: 10, flex: 1 }}>
                <p style={{ margin: 0, color: isDark ? "#94a3b8" : "#64748b", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <h3 style={{ margin: "4px 0", fontSize: "2.5rem", fontWeight: 900, color: isDark ? "#f8fafc" : "#1e293b", letterSpacing: "-0.02em" }}>{val}</h3>
                    {trend && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 10px", borderRadius: "8px" }}>
                            <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: "0.6rem" }}></i>
                            <span style={{ fontSize: "0.75rem", fontWeight: 800 }}>+{trend}%</span>
                        </div>
                    )}
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: isDark ? "#64748b" : "#94a3b8", fontWeight: 600 }}>{subtext}</p>
            </div>

            <div style={{ position: "relative", zIndex: 10 }}>
                <button 
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(!open); }}
                    style={{ 
                        padding: "8px 14px", borderRadius: 14, 
                        border: `1px solid rgba(0,0,0,0.08)`, 
                        background: "rgba(0,0,0,0.02)",
                        color: "#64748b", fontSize: "0.75rem", fontWeight: 700, 
                        cursor: "pointer", outline: "none",
                        display: "flex", alignItems: "center", gap: 8, transition: "0.3s"
                    }}
                >
                    {period}
                    <i className={`fa-solid fa-chevron-down`} style={{ fontSize: "0.55rem", opacity: 0.5, transform: open ? "rotate(180deg)" : "none", transition: "0.3s" }}></i>
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{ 
                                position: "absolute", top: "120%", right: 0, width: 140, 
                                background: isDark ? "#1f2937" : "#ffffff", borderRadius: "18px", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", 
                                boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.4)" : "0 20px 50px rgba(0,0,0,0.1)",
                                overflow: "hidden", zIndex: 100, padding: 6, backdropFilter: "blur(20px)"
                            }}
                        >
                            {periods.map((p) => (
                                <button
                                    key={p}
                                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPeriod(p); setOpen(false); }}
                                    style={{ 
                                        width: "100%", padding: "10px 12px", border: "none", 
                                        background: period === p ? color : "transparent",
                                        color: period === p ? "#ffffff" : (isDark ? "#f1f5f9" : "#1e293b"), 
                                        textAlign: "left", borderRadius: "12px",
                                        fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "0.2s"
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const ProTipCard = ({ isDark }) => {
    const tips = [
        "Surveillez les itinéraires en temps réel pour optimiser les horaires.",
        "Assurez-vous que les alertes de maintenance sont traitées sous 24h.",
        "Vérifiez l'affluence passagers pour identifier les heures de pointe.",
        "Communiquez directement avec les chauffeurs depuis le tableau de bord.",
        "Analysez l'historique des lignes pour proposer de meilleurs itinéraires."
    ];

    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [tips.length]);

    return (
        <div className="relative p-8 rounded-[32px] overflow-hidden shadow-2xl transition-all" 
             style={{ 
                 background: isDark 
                     ? "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)" 
                     : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                 color: "#ffffff",
                 minHeight: "280px",
                 display: "flex",
                 flexDirection: "column",
                 border: "1px solid rgba(255,255,255,0.1)"
             }}>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <i className="fa-solid fa-lightbulb text-yellow-300"></i>
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">CONSEIL ADMIN</h3>
                </div>
                
                <div className="flex-1 relative flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={currentTip}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.4 }}
                            className="text-blue-50 text-md leading-snug font-medium"
                        >
                            {tips[currentTip]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="space-y-4 mt-8">
                    <div className="flex justify-between items-end mb-1">
                        <p className="text-[10px] font-black uppercase opacity-70 tracking-widest text-white">Efficacité du Système</p>
                        <p className="text-xs font-black text-white">94%</p>
                    </div>
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "94%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-white rounded-full shadow-sm"
                        ></motion.div>
                    </div>
                    <p className="text-[10px] font-black opacity-60 text-center uppercase tracking-widest">Propulsé par BusWay Engine</p>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [stats, setStats] = useState({
        totalBuses: 0,
        activeBuses: 0,
        totalLines: 0,
        totalStops: 0,
        activeDrivers: 0,
        todayPassengers: 0,
        growth: "+0%"
    });
    const [chartData, setChartData] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/admin/dashboard_stats.php');
            if (response.data.success) {
                setStats(response.data.stats);
                if (response.data.chart) {
                    setChartData(response.data.chart);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
        // Check dark mode
        const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden" animate="show" variants={containerVariants}
            className="px-4 md:px-8 w-full relative pb-12 min-h-screen"
            style={{ background: isDark ? "#0a0a0a" : "#f4f6fa" }}
        >
            <div className="w-full space-y-8">
                {/* Header Section */}
                <div
                    className="max-lg:flex-col max-lg:justify-center max-lg:items-center"
                    style={{
                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : `1px solid rgba(0,0,0,0.05)`,
                        padding: "20px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 16,
                        marginBottom: "24px"
                    }}
                >
                    <div className="max-lg:w-full max-lg:flex max-lg:justify-center max-lg:mb-2" style={{ flex: 1 }}>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "1.2rem",
                                fontWeight: 900,
                                color: isDark ? "#f1f5f9" : "#1e293b",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                        <div
                            style={{
                                width: 42,
                                height: 42,
                                background: "rgba(37, 99, 235, 0.1)",
                                border: "1px solid rgba(37, 99, 235, 0.2)",
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative"
                            }}
                        >
                            <i className="fa-solid fa-gauge-high text-blue-600 text-xl" />
                        </div>
                        <span style={{ letterSpacing: "-0.02em" }}>Tableau de Bord</span>
                        </h1>
                    </div>

                    <div
                        className="flex max-lg:static max-lg:my-2 absolute left-1/2 -translate-x-1/2 max-lg:left-auto max-lg:translate-x-0"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 14px",
                            background: isDark ? "#111827" : "#ffffff",
                            borderRadius: 20,
                            border: isDark ? "1px solid #374151" : `1px solid #e5e7eb`,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >
                        <span style={{ fontSize: "0.7rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Admin</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: 8, color: isDark ? "#4b5563" : "#94a3b8" }} />
                        <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Vue d'ensemble</span>
                    </div>

                    <div className="max-lg:w-full max-lg:justify-center flex items-center gap-10 flex-1 justify-end">
                        <FleetActionButton onClick={() => navigate("/map")} isDark={isDark} />
                    </div>
                </div>

                {/* Welcome Message */}
                <motion.div variants={itemVariants} className="mb-10 w-full">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex flex-col md:block items-center md:items-start text-center md:text-left text-gray-900 dark:text-white">
                        <span className="block md:inline">Bienvenue, </span>
                        <span className="text-blue-600 relative inline-block">
                            {user.nom || "Admin"}
                            <span className="absolute bottom-1 left-0 w-full h-1.5 bg-blue-600 opacity-20 rounded-full"></span>
                        </span>
                        <div className="inline-block align-middle md:-ml-6 -mt-1 md:-mt-3">
                            <EyeTracking isDark={isDark} />
                        </div>
                    </h2>
                </motion.div>

                {/* Metrics Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard 
                        icon="fa-bus" label="Bus" 
                        val={stats.totalBuses} color="#3b82f6" trend="2" 
                        subtext={`${stats.activeBuses} En service`} 
                        isDark={isDark}
                    />
                    <StatCard 
                        icon="fa-route" label="Lignes" 
                        val={stats.totalLines} color="#8b5cf6" 
                        subtext="Réseau opérationnel" 
                        isDark={isDark}
                    />
                    <StatCard 
                        icon="fa-user-tie" label="Chauffeurs" 
                        val={stats.activeDrivers} color="#10b981" 
                        subtext="Connectés en direct" 
                        isDark={isDark}
                    />
                    <StatCard 
                        icon="fa-map-pin" label="Arrêts" 
                        val={stats.totalStops} color="#f59e0b" 
                        subtext="Points de ramassage" 
                        isDark={isDark}
                    />
                </motion.div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Activity Area */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 p-1 rounded-[32px] overflow-hidden" 
                         style={{ 
                             background: isDark ? "#111827" : "#ffffff", 
                             border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                             boxShadow: "0 10px 40px rgba(0,0,0,0.03)" 
                         }}>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-black flex items-center gap-3 text-gray-900 dark:text-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                            <i className="fa-solid fa-chart-area"></i>
                                        </div>
                                        Activité Mensuelle
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1 ml-13">Flux des inscriptions (6 derniers mois)</p>
                                </div>
                            </div>
                            
                            {chartData && chartData.series.length > 0 ? (
                                <Chart 
                                    options={{ 
                                        chart: { 
                                            type: "area", 
                                            toolbar: { show: false },
                                            fontFamily: "inherit"
                                        },
                                        colors: ["#3b82f6", "#10b981"],
                                        fill: {
                                            type: "gradient",
                                            gradient: {
                                                shadeIntensity: 1,
                                                opacityFrom: 0.4,
                                                opacityTo: 0.05,
                                            }
                                        },
                                        dataLabels: { enabled: false },
                                        stroke: { curve: "smooth", width: 3 },
                                        xaxis: { 
                                            categories: chartData.categories,
                                            labels: { style: { colors: isDark ? "#94a3b8" : "#64748b" } },
                                            axisBorder: { show: false },
                                            axisTicks: { show: false }
                                        },
                                        yaxis: {
                                            labels: { style: { colors: isDark ? "#94a3b8" : "#64748b" }, formatter: (val) => Math.floor(val) }
                                        },
                                        grid: { 
                                            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                                            strokeDashArray: 4,
                                            padding: { left: 20, right: 20 } 
                                        },
                                        legend: { show: true, position: 'top', horizontalAlign: 'right', labels: { colors: isDark ? "#f1f5f9" : "#1e293b" } },
                                        tooltip: { theme: isDark ? "dark" : "light" }
                                    }} 
                                    series={chartData.series} 
                                    type="area" 
                                    height={350} 
                                />
                            ) : (
                                <div className="h-[350px] flex items-center justify-center text-slate-400 font-bold">
                                    Chargement des données...
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-6">
                        <ProTipCard isDark={isDark} />
                        
                        <Link 
                            to="/map"
                            className="p-6 rounded-[28px] border bg-white dark:bg-gray-900 border-gray-100 dark:border-white/5 transition-all flex items-center justify-between group hover:-translate-y-1 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                    <i className="fa-solid fa-satellite"></i>
                                </div>
                                <p className="text-sm font-black text-gray-800 dark:text-gray-200 group-hover:text-blue-600">Surveillance temps réel</p>
                            </div>
                            <i className="fa-solid fa-arrow-right text-slate-400 group-hover:translate-x-1 transition-transform group-hover:text-blue-600"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
