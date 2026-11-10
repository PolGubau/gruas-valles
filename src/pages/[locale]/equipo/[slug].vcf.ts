import { equipo } from "../../../lib/equipo";
export { GET } from "../../equipo/[slug].vcf";

export function getStaticPaths() {
  return ["ca", "en"].flatMap((locale) => equipo.map((persona) => ({
    params: { locale, slug: persona.slug }, props: { persona },
  })));
}