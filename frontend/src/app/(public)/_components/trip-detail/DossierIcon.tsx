export default function DossierIcon({ name }: { name: string }) {
  // Preserve the intrinsic dimensions of the exported Figma SVG.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/trip-detail/${name}.svg`} alt="" className="shrink-0" />;
}
