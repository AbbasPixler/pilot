import React from "react";
import style from "./dashboard.module.css";
// import Spline from '@splinetool/react-spline';

export default function Dashboard() {
  return (
    <section className={style.main_content}>
      <div className={style.container_fluid}>
        <div className={style.boxes}>
          <div className={style.boxContent}>
            <p>Maien Angebote offen</p>
            <span>16</span>
          </div>
          <div className={style.boxContent}>
            <p>Maien Angebote offen</p>
            <span>16</span>
          </div>
        </div>
        {/* <div>
          <Spline scene="https://prod.spline.design/IRkSZkMs44eNx79d/scene.splinecode" />
        </div> */}
      </div>
    </section>
  );
}
