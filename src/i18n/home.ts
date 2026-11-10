import { ca } from "./home.ca";
import { en } from "./home.en";
import { es } from "./home.es";
import type { Lang } from "./utils";

const copies = { es, ca, en };

export function homeCopy(lang: Lang) {
  return copies[lang];
}