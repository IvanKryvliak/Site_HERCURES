export default function SectionHead({ tag, title, text }) {
  return (
    <div className="head">
      <span className="eyebrow">{tag}</span>
      <h2>{title}</h2>
      <p className="sub">{text}</p>
    </div>
  );
}
