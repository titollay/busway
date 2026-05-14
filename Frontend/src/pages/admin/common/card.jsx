import styled, { keyframes } from "styled-components";

const CARD_CONFIG = {
  Staff: {
    icon: "fa-solid fa-users",
    color: "#a855f7",
  },
  Clients: {
    icon: "fa-solid fa-user-check",
    color: "#22c55e",
  },
  Orders: {
    icon: "fa-solid fa-cart-shopping",
    color: "#f97316",
  },
  Sales: {
    icon: "fa-solid fa-coins",
    color: "#ef4444",
  },
  Products: {
    icon: "fa-solid fa-box",
    color: "#3b82f6",
  },
  default: {
    icon: "fa-solid fa-chart-line",
    color: "#f59e0b",
  },
};

export default function Card({ title, value, sub, trend }) {
  const cfg = CARD_CONFIG[title] || CARD_CONFIG.default;

  return (
    <StyledCard color={cfg.color}>
      <div className="card bg-white dark:bg-[#111] border rounded-xl border-gray-100 dark:border-white/5 transition-colors p-5 duration-300">
        <div className="header">
          <div className="icon">
            <i className={cfg.icon}></i>
          </div>

          {trend && (
            <span className={`trend ${trend > 0 ? "up" : "down"}`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>

        <p className="title text-[#777] dark:text-[#777]">{title}</p>

        <h2 className="value typing text-[#222] dark:text-[#ececec]">{value}</h2>

        <p className="sub text-[#666] dark:text-[#666]">{sub || "Updated now"}</p>
      </div>
    </StyledCard>
  );
}

/* animations */

const typing = keyframes`
0% { width:0 }
40% { width:100% }
60% { width:100% }
100% { width:0 }
`;

const blink = keyframes`
50% { border-color: transparent }
`;

const StyledCard = styled.div`
  width: 100%;

  .card {
    transition: all 0.25s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    border-color: ${(p) => p.color};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 8px;
    background: ${(p) => p.color}20;
    color: ${(p) => p.color};
  }

  .title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 4px;
  }

  .value {
    font-size: 24px;
    font-weight: 600;
    max-width: 100%;
  }

  .typing {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid #ececec71;
    display: inline-block;

    animation: ${typing} 6s steps(20) infinite, ${blink} 1s step-end infinite;
  }

  .sub {
    font-size: 11px;
  }

  .trend {
    font-size: 11px;
    padding: 3px 7px;
    border-radius: 6px;
  }

  .trend.up {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.15);
  }

  .trend.down {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.15);
  }
`;
