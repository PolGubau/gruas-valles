import type { APIRoute } from "astro";
import { homeCopy } from "@i18n/home";
import { getLangFromUrl } from "@i18n/utils";
import { buildVCard, equipo, type Persona } from "../../lib/equipo";

export function getStaticPaths() {
  return equipo.map((persona) => ({ params: { slug: persona.slug }, props: { persona } }));
}

export const GET: APIRoute = ({ props, url }) => {
  const persona = props.persona as Persona;
  const area = homeCopy(getLangFromUrl(url)).areas[persona.area] ?? persona.area;
  return new Response(buildVCard(persona, area), {
    headers: { "Content-Type": "text/vcard; charset=utf-8" },
  });
};