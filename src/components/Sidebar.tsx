import { useRef, useState } from "react";

import yayawalletLogo from "../assets/yayawallet-brand.svg";

const Sidebar = () => {
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openSidebarMenu = () => {
    setSidebarOpen(true);
  };

  return (
    <>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        ref={menuBtn}
        onClick={openSidebarMenu}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform  sm:translate-x-0 ${isSidebarOpen ? "" : "-translate-x-full"}`}
        aria-label="Sidebar"
        onClick={() => setSidebarOpen(false)}
      >
        <div className="h-full  py-3 overflow-y-auto bg-gray-50 ">
          <a href="/" className="flex items-center ps-2.5 mb-5 shadow-sm">
            <img src={yayawalletLogo} className="h-12" alt="YaYaWallet Logo" />
          </a>
          <div className="px-3">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                    Level 1
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
