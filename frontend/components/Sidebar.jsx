import React, { useEffect, useRef } from "react";

const Sidebar = ({ isOpen, setIsOpen, collapsed, setCollapsed }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const onClickAway = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("mousedown", onClickAway, true);
    document.addEventListener("touchstart", onClickAway, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onClickAway, true);
      document.removeEventListener("touchstart", onClickAway, true);
    };
  }, [isOpen, setIsOpen]);

  const randomUser = {
    name: "Asha Rao",
    avatar: `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='%23629BFF'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='80' fill='white'>AR</text></svg>`
    )}`,
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        ref={panelRef}
        className={`
          fixed top-0 left-0 z-40 h-screen bg-white border-r
          transition-all duration-300 flex flex-col justify-between
          ${collapsed ? "w-16" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        role="complementary"
        aria-label="Primary sidebar"
      >
        <div>
          <div className="h-14 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 grid place-items-center text-white font-bold">i</div>
              <span className="font-semibold select-none hidden xl:block">Inteliq</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                aria-label="Toggle collapse"
              >
                {collapsed ? "›" : "‹"}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-2 space-y-1 mt-4">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2">
              <span className="text-lg">🏠</span>
              <span className="hidden xl:inline text-sm">Home</span>
            </button>

            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2">
              <span className="text-lg">📚</span>
              <span className="hidden xl:inline text-sm">Library</span>
            </button>

            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2">
              <span className="text-lg">🕘</span>
              <span className="hidden xl:inline text-sm">History</span>
            </button>

            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring-2">
              <span className="text-lg">🔎</span>
              <span className="hidden xl:inline text-sm">Explore</span>
            </button>
          </nav>

          <div className="mt-6 px-3">
            <p className="text-xs text-gray-500 hidden xl:block mb-2">Recent Chats</p>
            <div className="space-y-2">
              {["Write a sonnet...", "Energy trends", "Refund email"].map((t, i) => (
                <button
                  key={i}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-100 line-clamp-1"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom area: user avatar + name. When collapsed only avatar is visible. */}
        <div className="px-3 py-4">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "justify-start"}`}>
            <img
              src={randomUser.avatar}
              alt={randomUser.name}
              className="h-10 w-10 rounded-full object-cover border"
            />

            {/* show name & small actions only when not collapsed */}
            {!collapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium">{randomUser.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <button className="text-xs px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2">
                    Profile
                  </button>
                  <button className="text-xs px-2 py-1 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
