import dossierUrl from "../assets/docs/Doc_DOSSIER_GruasValles_2025.pdf";

// Catálogo / díptico informativo de la empresa. Centralizado aquí para
// reutilizar la misma URL, nombre de descarga y etiqueta en toda la web.
export const catalogo = {
	url: dossierUrl,
	filename: "Catalogo-Gruas-del-Valles-2025.pdf",
	label: "Descargar catálogo",
};

/**
 * Resolutor de PDFs de noticias en `src/assets/docs/blog`.
 *
 * Las entradas de blog referencian sus documentos con rutas tipo
 * `/assets/docs/blog/foo.pdf`. Al estar en `src/assets`, Astro los procesa y
 * emite una URL con hash; este mapa traduce cada referencia a esa URL final.
 */
const docModules = import.meta.glob<{ default: string }>(
	"../assets/docs/blog/*.pdf",
	{ eager: true },
);

const docsByRef = new Map<string, string>(
	Object.entries(docModules).map(([path, mod]) => {
		const file = path.split("/").pop() ?? path;
		return [`/assets/docs/blog/${file}`, mod.default];
	}),
);

/** Devuelve la URL final de un PDF de noticia; si no existe, la deja intacta. */
export function resolveDoc(ref: string): string {
	return docsByRef.get(ref) ?? ref;
}
