import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Header/Navbar.jsx"
import SidebarLeft from "@/components/Home/SidebarLeft.jsx";
import SidebarRight from "@/components/Home/SidebarRight.jsx";
import Feed from "@/components/Home/Feed.jsx";

export default function Home() {
  return (
      <>
          <Navbar />
          <div className="container-fluid mt-4">
              <div className="row justify-content-center">
                  <div className="col-md-3 d-none d-md-block">
                      <SidebarLeft />
                  </div>
                  <div className="col-md-6">
                      <Feed />
                  </div>
                  <div className="col-md-3 d-none d-md-block">
                      <SidebarRight />
                  </div>
              </div>
          </div>
      </>
  );
}
