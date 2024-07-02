import React from "react";
import "../components/fiestHome.css";
import Header from "./Header";

const FirstHome = () => {
  return (
    <>
      <div className="wrapper">
        <div className="title animate">旅をしながら、移住する</div>
        <p className="text animate">ゲストハウス×旅人のマッチングサービス</p>
      </div>
      <div className="section">
        <div className="sectionWrapper">
          <div className="sectionItem">
            <div className="sectionFlex">
              <h2 className="subTitle animate">
                ハウスキーパーとして働く代わりに
                <br />
                家賃タダ
              </h2>
              <p className="subText animate">
                低コストだから移住のハードルがぐっと下がる
              </p>
            </div>
            <div className="img1 animate"></div>
          </div>
          <div className="sectionItem2">
            <div className="sectionFlex">
              <h2 className="subTitle animate">
                期間限定OK！ <br />
                まずはお試しってノリで
              </h2>
              <p className="subText animate">
                移住期間を1ヶ月から選べるから気楽にトライ
              </p>
            </div>
            <div className="img2 animate"></div>
          </div>
          <div className="sectionItem">
            <div className="sectionFlex">
              <h2 className="subTitle animate">
                憧れの場所で自分に合った <br />
                ライフスタイルを見つけよう
              </h2>
              <p className="subText animate">
                住んでみたかったあの場所で、最高の体験に出会える
              </p>
            </div>
            <div className="img3 animate"></div>
          </div>
        </div>
      </div>
      <Header />
    </>
  );
};

export default FirstHome;