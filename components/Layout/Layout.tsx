import React, { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiMenuAltRight } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoNotificationsSharp } from "react-icons/io5";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippy.js/react";

import { FadeSide } from "../Animation/SimpleAnimation";
import AppContext from "../Context/AppContext";
import UpperMenu from "../FINANCE/UpperMenu";
import ChangePassword from "../HOC/ChangePassword";
import { LoginUserInfo } from "../HOC/LoginUser/UserInfo";
import PrompMessage from "../Reusable/PrompMessage";
import ProfileMenu from "./ProfileMenu";
import Sidebar from "./Sidebar";

type Layout = {
  children: React.ReactNode;
};

export default function Layout({ children }: Layout) {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");

  const { togglePrompt, collapseSide, setCollapseSide } =
    useContext(AppContext);

  const [isProfileSearch, setProfileSearch] = useState(false);

  const [isPathName, setPathName] = useState<any>();

  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

  const [financeMenu, setFinanceMenu] = useState(false);

  const [isChangePasswordModal, setChangePasswordModal] = useState(false);

  // toggle for responsive sidebar
  const [isWide, setWide] = useState(false);

  const [isHide, setHide] = useState<boolean>(false);

  const [isWindow, setWindow] = useState<any>();

  useEffect(() => {
    const updateSize = () => {
      window.innerWidth <= 820 ? setHide(true) : setHide(false);
      window.innerWidth <= 1024
        ? window.innerWidth <= 820
          ? setCollapseSide(false)
          : setCollapseSide(true)
        : setCollapseSide(false);
      setWindow(window.innerWidth);
    };
    window.addEventListener("resize", updateSize);
    setWindow(window.innerWidth);
  }, [isWindow]);

  // it opens the sidebar search when depending on following asPath
  useEffect(() => {
    router.pathname.split("/")[1]
      ? setTitle(router.pathname.split("/")[1])
      : setTitle("Dashboard");
    setPathName(router.asPath);
    if (
      router.asPath.includes("corporate/") ||
      router.asPath.includes("user/") ||
      router.asPath.includes("customer/") ||
      router.asPath.includes("property/") ||
      router.pathname.includes("journal-list/[id]") ||
      router.pathname.includes("billing/invoice-list/[id]") ||
      router.pathname.includes("/payment-register/[id]") ||
      router.pathname.includes("/adjustment-list/[id]") ||
      router.pathname.includes("/access/[id]") ||
      router.pathname.includes("/check-payment-list/[id]") ||
      router.pathname.includes("/favorite-list-reports/[id]")
    ) {
      setProfileSearch(true);
    } else {
      setProfileSearch(false);
    }
    // Wide the sidebar
    if (router.query.id !== undefined) {
      setWide(true);
    } else {
      setWide(false);
    }
    // Show finance Upper Menu
    if (
      router.pathname.includes("finance") &&
      !router.pathname.includes("/policy")
    ) {
      setFinanceMenu(true);
    } else {
      setFinanceMenu(false);
    }
  }, [router.asPath]);

  const [userPhoto, setUserPhoto] = useState("/Images/sampleProfile.png");

  const [userInfo, setUserInfo] = useState<LoginUserInfo>();

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.userInfo));
  }, []);

  useEffect(() => {
    if (userInfo?.image_photo !== null) {
      setUserPhoto(
        `https://boroughcrest-api.lws.codes/get-img?image=${userInfo?.image_photo}`
      );
    } else {
      setUserPhoto("/Images/sampleProfile.png");
    }
  }, [userInfo]);

  return (
    <>
      <Head>
        <title>Boroughcrest- {title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex min-h-screen bg-blend-multiply">
        <AnimatePresence>
          {togglePrompt.toggle && <PrompMessage />}
        </AnimatePresence>

        <AnimatePresence>
          {!isHide && (
            <Sidebar
              isProfileSearch={isProfileSearch}
              setProfileSearch={setProfileSearch}
              isPathName={isPathName}
              setHide={setHide}
              isWide={isWide}
              isWindow={isWindow}
            />
          )}
        </AnimatePresence>

        {isChangePasswordModal && (
          <ChangePassword setChangePasswordModal={setChangePasswordModal} />
        )}

        <section
          className={` transition-all duration-150 flex flex-col w-full bg-MainBG bg-no-repeat bg-cover h-screen overflow-auto ${
            isWide === true ? "pl-wide" : "pl-no-wide"
          } ${collapseSide && !isWide && "collapse_container"}`}
        >
          <div className="flex-1 flex flex-col w-full relative 1024px:py-5">
            {isWindow <= 1024 && (
              <div className=" flex justify-end pr-5">
                <button
                  onClick={() => setHide(!isHide)}
                  className={`  right-5 top-3 text-[16px] duration-75 ease-in-out p-1 px-5 shadow-lg rounded-full ${
                    isHide
                      ? "bg-ThemeRed text-white"
                      : "bg-white text-ThemeRed pointer-events-none"
                  }`}
                >
                  <BiMenuAltRight />
                </button>
              </div>
            )}
            <header
              className={` flex ${
                router.pathname === "/" ? "justify-between" : "justify-end"
              } items-center justify-between px-14 1550px:px-10 480px:flex-wrap 480px:justify-end`}
            >
              <AnimatePresence>
                {collapseSide ? (
                  <motion.div
                    variants={FadeSide}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative h-20 w-48"
                  >
                    <Image src="/Images/deus.png" layout="fill" alt="" />
                  </motion.div>
                ) : (
                  <p className="h-20"></p>
                )}
              </AnimatePresence>
              {router.pathname === "/" && (
                <div className="flex items-center px-8 py-4 bg-white flex-1 max-w-[600px] rounded-lg shadow-lg 640px:px-4 640px:py-2 480px:order-2">
                  <input
                    type="text"
                    className="flex-1 outline-none text-14px "
                    placeholder="Search anything here..."
                  />
                  <BsSearch className=" mr-2 text-gray-500 text-[18px]" />
                </div>
              )}
              <ul className=" flex items-center ml-5  480px:my-2">
                <li className=" relative mr-5 cursor-pointer">
                  <Tippy
                    theme="ThemeRed"
                    content={<span className="capitalize">Notification</span>}
                  >
                    <div>
                      <IoNotificationsSharp className=" text-ThemeRed text-[24px] hover:scale-[1.3] transition duration-75" />
                    </div>
                  </Tippy>

                  <div className="absolute w-[15px] h-[15px] text-[11px] top-[-5%] right-[-8%] flex justify-center items-start rounded-full bg-Green text-white">
                    1
                  </div>
                </li>
                <li className=" flex items-center">
                  <aside className=" w-10 h-10 rounded-full overflow-hidden relative shadow-lg mr-3">
                    <Image
                      src={userPhoto}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                    />
                  </aside>
                  <div className="relative">
                    <p
                      className="flex items-center cursor-pointer relative"
                      onClick={() => setToggleProfileMenu(!toggleProfileMenu)}
                    >
                      {userInfo?.name} <IoIosArrowDown className="ml-1 mt-1" />
                    </p>
                    {toggleProfileMenu && (
                      <ProfileMenu
                        setToggleProfileMenu={setToggleProfileMenu}
                        setChangePasswordModal={setChangePasswordModal}
                      />
                    )}
                  </div>
                </li>
              </ul>
            </header>
            {financeMenu && <UpperMenu />}
            <main className="relative flex-1 flex flex-col px-14 1550px:px-10 480px:px-5">
              {children}
            </main>
          </div>
          <footer className="w-full py-5 flex justify-end items-center px-10 1024px:px-5">
            <p className=" text-ThemeRed text-sm 480px:text-[11px] font-medium">
              2022 Boroughcrest Property Management Systems Corp. All rights
              reserved.
            </p>
          </footer>
        </section>
      </div>
    </>
  );
}
