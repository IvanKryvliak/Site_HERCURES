import { COMPANY } from "../data/config";
import { addressLine, idsLine } from "../data/privacy";

export default function Footer({ t }) {
  const legal = [COMPANY.name, addressLine(), idsLine(), COMPANY.status].filter(Boolean).join(", ");
  return (
    <footer>
      <div className="wrap"><span>{t.foot[0]}</span><span>{t.foot[1]}</span></div>
      <div className="wrap footer-legal">
        <span>{t.operator}: {legal}</span>
        <a href="#/privacy">{t.privacy}</a>
      </div>
    </footer>
  );
}
