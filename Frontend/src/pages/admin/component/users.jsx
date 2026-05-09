import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";

const ROLE_CFG = {
  admin: {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  staff: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  customer: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  default: {
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
};

const AVATAR_COLORS = [
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-green-500/20  text-green-400  border-green-500/30",
  "bg-blue-500/20   text-blue-400   border-blue-500/30",
  "bg-red-500/20    text-red-400    border-red-500/30",
  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
];

function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w?.[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const cls = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div
      className={`w-8 h-8 dark:w-7 dark:h-7 rounded-full border flex items-center justify-center text-[0.6rem] font-bold shrink-0 ${cls}`}
    >
      {initials}
    </div>
  );
}

function Badge({ role }) {
  const cfg = ROLE_CFG[role] || ROLE_CFG.default;
  return (
    <span
      className={`text-[0.58rem] dark:text-[0.5rem] tracking-widest uppercase px-2 py-0.5 rounded border font-semibold ${cfg.text} ${cfg.bg} ${cfg.border}`}
    >
      {role}
    </span>
  );
}

// ── Modal wrapper ──
function Modal({ onBg, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center dark:items-start justify-center p-5 bg-black/75 dark:bg-[#111] dark:bg-black/75 backdrop-blur-sm"
      onClick={onBg}
    >
      {children}
    </motion.div>
  );
}

// ── Edit / Add Modal ──
function UserModal({ user, onSave, onClose }) {
  const [form, setForm] = useState(
    user || {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      role: "staff",
    }
  );
  const isNew = !user?.id;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal onBg={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/5 rounded-2xl p-8 w-full max-w-md shadow-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <p className="text-[0.58rem] dark:text-[0.5rem] tracking-[0.22em] uppercase text-white/25 mb-1">
            {isNew ? "New User" : "Edit User"}
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-[1.8rem] font-light text-gray-900 dark:text-[#ececec]">
            {isNew
              ? "Add Staff Member"
              : `${form.first_name} ${form.last_name}`}
          </h3>
        </div>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            ["first_name", "First Name"],
            ["last_name", "Last Name"],
          ].map(([k, l]) => (
            <div key={k}>
              <label className="block text-[0.58rem] dark:text-[0.5rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
                {l}
              </label>
              <input
                value={form[k] || ""}
                onChange={(e) => set(k, e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg
                  text-gray-900 dark:text-white/80 text-sm font-['DM_Sans'] outline-none
                  focus:border-orange-500/50 transition-colors placeholder-gray-400 dark:placeholder-white/20"
              />
            </div>
          ))}
        </div>

        {/* Email + Phone */}
        {[
          ["email", "Email Address", "email"],
          ["phone", "Phone Number", "tel"],
        ].map(([k, l, t]) => (
          <div key={k} className="mb-3">
            <label className="block text-[0.58rem]  dark:text-[0.5rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              {l}
            </label>
            <input
              type={t}
              value={form[k] || ""}
              onChange={(e) => set(k, e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg
                text-gray-900 dark:text-white/80 text-sm font-['DM_Sans'] outline-none
                focus:border-orange-500/50 transition-colors placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
        ))}

        {/* Password (New users only) */}
        {isNew && (
          <div className="mb-3">
            <label className="block text-[0.58rem] dark:text-[0.5rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={form.password || ""}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Enter secure password"
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg
                text-gray-900 dark:text-white/80 text-sm font-['DM_Sans'] outline-none
                focus:border-orange-500/50 transition-colors placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
        )}

        {/* Role */}
        <div className="mb-7">
          <label className="block text-[0.58rem] dark:text-[0.5rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-2">
            Role
          </label>
          <div className="flex gap-2 dark:gap-1 flex-wrap">
            {["admin", "customer"].map((r) => {
              const cfg = ROLE_CFG[r] || ROLE_CFG.default;
              const active = form.role === r;
              return (
                <button
                  key={r}
                  onClick={() => set("role", r)}
                  className={`px-4 py-1.5 rounded-md text-[0.62rem] tracking-widest uppercase border transition-all
                    ${
                      active
                        ? `${cfg.bg} ${cfg.border} ${cfg.text}`
                        : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-white/35 hover:border-gray-300 dark:hover:border-white/20"
                    }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg
              text-white/40 text-[0.7rem] tracking-widest uppercase
              hover:border-white/20 transition-colors font-['DM_Sans']"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 bg-[#FC8C06] border-none rounded-lg text-white
              text-[0.7rem] tracking-widest uppercase hover:bg-[#d97500]
              transition-colors font-['DM_Sans']"
          >
            {isNew ? "Add User" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}

// ── Delete Confirm ──
function DeleteModal({ user, onConfirm, onClose }) {
  return (
    <Modal onBg={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#111] border border-red-500/20 rounded-2xl p-8 w-80 shadow-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl
          flex items-center justify-center mb-4"
        >
          <i className="fa-solid fa-trash-can text-red-400 text-base"></i>
        </div>
        <p className="text-[0.58rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/25 mb-1">
          Confirm
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-[#ececec] mb-2">
          Remove User?
        </h3>
        <p className="text-[0.78rem] text-gray-500 dark:text-white/40 leading-relaxed mb-6 font-['DM_Sans']">
          Delete{" "}
          <strong className="text-gray-900 dark:text-white">
            {user?.first_name} {user?.last_name}
          </strong>
          ? This cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-1.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-lg
              text-gray-400 dark:text-white/40 text-[0.7rem] tracking-widest uppercase
              hover:border-gray-300 dark:hover:border-white/20 transition-colors font-['DM_Sans']"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user)}
            className="flex-1 py-2.5 bg-red-500/15 border border-red-500/30 rounded-lg
              text-red-400 text-[0.7rem] tracking-widest uppercase
              hover:bg-red-500/25 transition-colors font-['DM_Sans']"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </Modal>
  );
}

// ── Toast ──
function Toast({ toast }) {
  const ok = toast?.type !== "error";
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-7 right-7 z-[200] flex items-center gap-3
            px-5 py-3 rounded-xl border text-sm font-['DM_Sans']
            shadow-2xl shadow-black/50
            ${
              ok
                ? "bg-green-500/15 border-green-500/30 text-green-400"
                : "bg-red-500/15   border-red-500/30   text-red-400"
            }`}
        >
          <i
            className={`fa-solid fa-${ok ? "circle-check" : "circle-xmark"}`}
          ></i>
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sort Header ──
function SortTh({ label, col, sortKey, sortDir, onSort }) {
  const active = sortKey === col;
  return (
    <th
      onClick={() => onSort(col)}
      className="text-left text-[0.58rem] tracking-[0.18em] uppercase
        text-gray-400 dark:text-white/30 px-3.5 py-3 cursor-pointer select-none whitespace-nowrap
        hover:text-black/50 dark:hover:text-white/50 transition-colors"
    >
      <span className="flex items-center gap-1.5">
        {label}
        {active && (
          <i
            className={`fa-solid fa-chevron-${
              sortDir === "asc" ? "up" : "down"
            } text-[0.42rem] text-orange-500`}
          ></i>
        )}
      </span>
    </th>
  );
}

const PER_PAGE = 8;

export default function StaffTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [editRow, setEditRow] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [delUser, setDelUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = () => {
    setLoading(true);
    fetch(`${config.API_BASE_URL}/admin/users.php`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") {
          const arr = Array.isArray(d.data)
            ? d.data
            : d.data.staff_user
            ? Array.isArray(d.data.staff_user)
              ? d.data.staff_user
              : [d.data.staff_user]
            : [];
          setRows(arr);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = rows
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        (!q ||
          `${r.first_name} ${r.last_name} ${r.email}`
            .toLowerCase()
            .includes(q)) &&
        (roleFilter === "all" || r.role === roleFilter)
      );
    })
    .sort((a, b) => {
      const av = a[sortKey] || "",
        bv = b[sortKey] || "";
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const allSel =
    paged.length > 0 && paged.every((r) => selected.includes(r.id));
  const roles = ["all", ...new Set(rows.map((r) => r.role))];

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };
  const toggleSel = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  const toggleAll = () =>
    setSelected(
      allSel
        ? selected.filter((id) => !paged.map((r) => r.id).includes(id))
        : [...new Set([...selected, ...paged.map((r) => r.id)])]
    );

  const handleSave = (form) => {
    const url = form.id
      ? `${config.API_BASE_URL}/admin/update_staff.php`
      : `${config.API_BASE_URL}/admin/add_staff.php`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then(() => {
        setEditRow(null);
        setNewUser(false);
        fetchData();
        showToast(form.id ? "User updated" : "User added");
      })
      .catch(() => showToast("Something went wrong", "error"));
  };

  const handleDelete = (user) => {
    fetch(`${config.API_BASE_URL}/admin/delete_staff.php?id=${user.id}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then(() => {
        setDelUser(null);
        fetchData();
        showToast(`${user.first_name} deleted`);
      })
      .catch(() => showToast("Delete failed", "error"));
  };

  const handleBulkDelete = () => {
    Promise.all(
      selected.map((id) =>
        fetch(`${config.API_BASE_URL}/admin/delete_staff.php?id=${id}`, {
          method: "DELETE",
        })
      )
    ).then(() => {
      setSelected([]);
      fetchData();
      showToast(`${selected.length} users deleted`);
    });
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <AnimatePresence>
        {(editRow || newUser) && (
          <UserModal
            user={editRow || null}
            onSave={handleSave}
            onClose={() => {
              setEditRow(null);
              setNewUser(false);
            }}
          />
        )}
        {delUser && (
          <DeleteModal
            user={delUser}
            onConfirm={handleDelete}
            onClose={() => setDelUser(null)}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} />

      <div className="min-h-full  px-9 py-8 font-['DM_Sans']">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <p className="text-[0.58rem] tracking-[0.25em] uppercase text-black/30 mb-1">
            Management
          </p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h1 className="font-['Cormorant_Garamond'] text-[2.4rem] font-light text-gray-900 dark:text-white/90 leading-none">
              Staff Users
            </h1>
            <div className="flex items-center text-[0.75rem] text-gray-400 dark:text-white/30 gap-2">
              <Link
                to="/index"
                className="hover:text-[#FC8C06] transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600 dark:text-white/60 font-medium">Staff</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[0.62rem] tracking-wider text-gray-400 dark:text-white/25">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
              <AnimatePresence>
                {selected.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3.5 py-2 bg-red-500/8 border border-red-500/25
                      rounded-lg text-red-400 text-[0.65rem] tracking-widest uppercase
                      hover:bg-red-500/15 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can text-[0.55rem]"></i>
                    Delete {selected.length}
                  </motion.button>
                )}
              </AnimatePresence>
              <button
                onClick={() => setNewUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FC8C06] rounded-lg
                  text-black text-[0.65rem] tracking-widest uppercase
                  hover:bg-[#d97500] transition-colors"
              >
                <i className="fa-solid fa-plus text-[0.55rem]"></i>
                Add Staff
              </button>
            </div>
          </div>
          <div className="h-px bg-gray-200 dark:bg-white/[0.08] mt-4" />
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-4 flex-wrap"
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5
            rounded-lg px-3.5 py-2.5 flex-1 max-w-xs transition-colors duration-300"
          >
            <i className="fa-solid fa-magnifying-glass text-[0.65rem] text-gray-400 dark:text-white/20"></i>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search staff..."
              className="bg-transparent border-none outline-none text-[0.8rem]
                text-gray-900 dark:text-[#ececec] w-full placeholder-gray-400 dark:placeholder-white/20 font-['DM_Sans']"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(0);
                }}
                className="text-black/25 hover:text-black/50 transition-colors leading-none"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            )}
          </div>

          {/* Role pills */}
          {/* <div className="flex gap-1.5 flex-wrap">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setPage(0);
                }}
                className={`px-3.5 py-1.5 rounded-md text-[0.62rem] tracking-widest uppercase
                  border transition-all
                  ${
                    roleFilter === r
                      ? "bg-orange-500/8 border-orange-500 text-orange-500"
                      : "bg-white border-black/10 text-black/40 hover:border-black/25"
                  }`}
              >
                {r}
              </button>
            ))}
          </div> */}

          <span className="text-[0.62rem] tracking-widest uppercase text-black/30 ml-auto">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* ── Table card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-[#111] py-2 px-3 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors duration-300"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className="w-7 h-7 border-2 border-orange-500 border-t-transparent
                rounded-full animate-spin"
              />
              <p className="text-[0.62rem] tracking-[0.2em] uppercase text-black/20">
                Loading
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className="px-3.5 py-3 w-11">
                      <input
                        type="checkbox"
                        checked={allSel}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 cursor-pointer accent-orange-500"
                      />
                    </th>
                    <SortTh
                      label="Staff Member"
                      col="first_name"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortTh
                      label="Email"
                      col="email"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <th className="text-left text-[0.58rem] tracking-[0.18em] uppercase text-black/25 px-3.5 py-3 whitespace-nowrap">
                      Phone
                    </th>
                    <SortTh
                      label="Role"
                      col="role"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortTh
                      label="Joined"
                      col="created_at"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortTh
                      label="Last Update"
                      col="updated_at"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <th className="text-right text-[0.58rem] tracking-[0.18em] uppercase text-black/25 px-3.5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paged.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-14 text-black/20 text-sm font-['DM_Sans']"
                        >
                          No staff members found
                        </td>
                      </tr>
                    ) : (
                      paged.map((row, i) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.22, delay: i * 0.04 }}
                          className={`border-b border-gray-50 dark:border-white/5 transition-colors
                          ${
                            selected.includes(row.id)
                              ? "bg-orange-500/[0.04]"
                              : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-3.5 py-3.5 w-11">
                            <input
                              type="checkbox"
                              checked={selected.includes(row.id)}
                              onChange={() => toggleSel(row.id)}
                              className="w-3.5 h-3.5 cursor-pointer accent-orange-500"
                            />
                          </td>

                          {/* User */}
                          <td className="px-3.5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={`${row.first_name} ${row.last_name}`}
                              />
                              <div>
                                <p className="text-[0.8rem] font-medium text-gray-900 dark:text-white/85 leading-tight">
                                  {row.first_name} {row.last_name}
                                </p>
                                <p className="text-[0.58rem] text-gray-400 dark:text-white/20 mt-0.5">
                                  #{row.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-3.5 py-3.5 text-[0.75rem] text-gray-500 dark:text-white/40">
                            {row.email}
                          </td>

                          {/* Phone */}
                          <td className="px-3.5 py-3.5 text-[0.75rem] text-gray-500 dark:text-white/40">
                            {row.phone || "—"}
                          </td>

                          {/* Role */}
                          <td className="px-3.5 py-3.5">
                            <Badge role={row.role} />
                          </td>

                          {/* Joined */}
                          <td className="px-3.5 py-3.5 text-[0.7rem] text-gray-400 dark:text-white/30">
                            {fmtDate(row.created_at)}
                          </td>

                          {/* Updated */}
                          <td className="px-3.5 py-3.5 text-[0.7rem] text-gray-400 dark:text-white/25">
                            {fmtDate(row.updated_at)}
                          </td>

                          {/* Actions */}
                          <td className="px-3.5 py-3.5">
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => setEditRow(row)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                bg-orange-500/8 border border-orange-500/20 text-orange-500
                                hover:bg-orange-500/20 transition-colors"
                              >
                                <i className="fa-solid fa-pen text-[0.6rem]"></i>
                              </button>
                              <button
                                onClick={() => setDelUser(row)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                bg-red-500/8 border border-red-500/20 text-red-400
                                hover:bg-red-500/20 transition-colors"
                              >
                                <i className="fa-solid fa-trash-can text-[0.6rem]"></i>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div
              className="flex items-center justify-between px-5 py-3
              border-t border-black/[0.05]"
            >
              <span className="text-[0.62rem] tracking-widest uppercase text-black/20">
                {page * PER_PAGE + 1}–
                {Math.min((page + 1) * PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3.5 py-1.5 bg-black/[0.04] border border-black/[0.07] rounded-md
                    text-black/40 text-[0.62rem] tracking-widest uppercase
                    disabled:opacity-30 hover:border-black/20 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-md text-[0.72rem] transition-colors
                      ${
                        page === i
                          ? "bg-orange-500/12 border border-orange-500 text-orange-500"
                          : "bg-black/[0.04] border border-black/[0.07] text-black/40 hover:border-white/20"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page === totalPages - 1}
                  className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-md
                    text-black/40 text-[0.62rem] tracking-widest uppercase
                    disabled:opacity-30 hover:border-white/20 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
