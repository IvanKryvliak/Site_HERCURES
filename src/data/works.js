/* Фото реалізацій беруться АВТОМАТИЧНО з папки src/assets/works/.
   Покладіть туди фото (jpg, png, webp), і вони зʼявляться в галереї.
   Підпапки = категорії для фільтрів: works/byty/, works/domy/, works/koupelny/ ...
   Назва файлу = підпис: "01-obyvaci-pokoj.jpg" -> "obyvaci pokoj". */
const files = import.meta.glob("../assets/works/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
});

const pretty = (name) => name.replace(/\.[^.]+$/, "").replace(/^\d+[-_.\s]*/, "").replace(/[-_]+/g, " ").trim();

export const WORKS = Object.entries(files)
  .map(([path, src]) => {
    const parts = path.split("/assets/works/")[1].split("/");
    const file = parts.pop();
    return { id: path, src, category: parts[0] || "", title: pretty(file) };
  })
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
