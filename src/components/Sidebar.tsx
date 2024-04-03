import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserProfile } from "../models";
import { BASE_URL } from "../constants";

import yayawalletLogo from "../assets/yayawallet-brand.svg";
import avater from "../assets/avater.svg";

const Sidebar = () => {
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    axios.get(`${BASE_URL}/getProfile`).then((res) => {
      setProfile(res.data);
    });
  }, []);

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
      >
        <div className="h-full  py-3 overflow-y-auto bg-gray-50 ">
          <Link to="/" className="flex items-center ps-2.5 mb-5 shadow-sm">
            <img src={yayawalletLogo} className="h-12" alt="YaYaWallet Logo" />
          </Link>

          <button
            type="button"
            className="sm:hidden flex text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-4 end-2 items-center justify-center"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close menu</span>
          </button>

          <div className="px-3">
            <ul className="space-y-2 font-medium">
              <li>
                <div className="flex justify-center p-2">
                  <Link to="/profile">
                    <img
                      src={profile?.photo_url || avater}
                      alt=""
                      className="w-24 h-24 rounded-full "
                    />
                  </Link>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <span className="flex-1 ms-3">
                    {profile?.name.split(" ").slice(0, 2).join(" ") || (
                      <span>&nbsp;</span>
                    )}
                  </span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
                    {profile?.type.replace(/([a-zA-Z])(\d)/g, "$1 $2") ||
                      "LEVEL -"}
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/create-transaction"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <span className="flex-1 ms-3">Make Transaction</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/generate-qr-code"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Generate QR Code
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/transfer-list"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Transfer List
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/transaction-list"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Transaction List By User
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/verify-transaction-id"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Verify Transaction ID
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/check-transfer-fee"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Check Transfer Fee
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/external-account-lookup"
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    External Account Lookup
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
