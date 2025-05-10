import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar.jsx"
import SidebarLeft from "@/components/SidebarLeft.jsx";
import SidebarRight from "@/components/SidebarRight.jsx";
import Feed from "@/components/Feed.jsx";

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
