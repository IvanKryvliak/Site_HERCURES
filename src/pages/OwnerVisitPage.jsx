import { useEffect } from "react";
import PaintBackground from "../components/PaintBackground";
import useNoIndex from "../hooks/useNoIndex";
import { setIgnored } from "../lib/ignoreSelf";
import "../styles/site.css";
import "../styles/analytics.css";

/* /#/ignore — не рахувати цей пристрій; /#/count — знову рахувати. */
export default function OwnerVisitPage({ ignore }) {
  useNoIndex();
  useEffect(() => { setIgnored(ignore); }, [ignore]);

  return (
    <div className="cs an" lang="ru">
      <PaintBackground />
      <div className="an-wrap">
        <div className="an-panel an-owner">
          <h1>{ignore ? "Готово" : "Визиты снова учитываются"}</h1>
          <p>
            {ignore
              ? "Ваши посещения с этого устройства больше не попадают в статистику."
              : "Посещения с этого устройства снова учитываются в статистике."}
          </p>
          <a className="an-back" href="#/">← Назад на сайт</a>
        </div>
      </div>
    </div>
  );
}
