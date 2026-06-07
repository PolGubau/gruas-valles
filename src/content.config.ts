import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import flotaRaw from "./data/flota.json";
import maniobrasRaw from "./data/maniobras.json";
import { slugify } from "./lib/slugify";

/**
 * Colecciones de contenido (Astro Content Layer).
 *
 * Usamos loaders «inline» que transforman los JSON existentes en una lista
 * plana de entradas, cada una con un `id` = slug determinista. Así mantenemos
 * los JSON como única fuente de datos y obtenemos URLs limpias + validación Zod
 * sin añadir dependencias ni duplicar contenido.
 */

const imagenes = z.array(z.string()).default([]);

const flota = defineCollection({
	loader: () => {
		let orden = 0;
		return flotaRaw.flatMap((cat) =>
			cat.modelos.map((m) => ({
				id: slugify(m.modelo),
				categoria: cat.categoria,
				orden: orden++,
				...m,
			})),
		);
	},
	schema: z.object({
		modelo: z.string(),
		categoria: z.string(),
		orden: z.number(),
		nuevo: z.boolean().optional(),
		nota: z.string().optional(),
		extra: z.string().optional(),
		tipo: z.string().optional(),
		grua: z.string().optional(),
		camion: z.string().optional(),
		modelo_maquina: z.string().optional(),
		capacidad_max_t: z.number().optional(),
		capacidad_tm: z.number().optional(),
		pluma_telescopica_m: z.number().optional(),
		pluma_horizontal_m: z.number().optional(),
		pluma_m: z.number().optional(),
		pluma_jib_m: z.number().optional(),
		pluma_con_jib_m: z.number().optional(),
		plumin_m: z.number().optional(),
		plumin_fijo_m: z.number().optional(),
		plumin_abatible_m: z.number().optional(),
		plumin_angulado_m: z.number().optional(),
		plumin_abatible_hasta_m: z.number().optional(),
		plumin_fijo_hasta_m: z.number().optional(),
		plumin_angulable_deg: z.number().optional(),
		plumin_abatible_deg: z.union([z.string(), z.number()]).optional(),
		peso_punta_kg: z.number().optional(),
		doble_jib_m: z.number().optional(),
		altura_maxima_m: z.number().optional(),
		tara_kg: z.number().optional(),
		mma_kg: z.number().optional(),
		ejes: z.number().optional(),
		ejes_motrices: z.number().optional(),
		alto_m: z.number().optional(),
		ancho_m: z.number().optional(),
		largo_m: z.number().optional(),
		imagenes,
	}),
});

const maniobras = defineCollection({
	loader: () =>
		maniobrasRaw.map((m, orden) => ({ ...m, id: slugify(m.titulo), orden })),
	schema: z.object({
		titulo: z.string(),
		descripcion: z.string(),
		orden: z.number(),
		gruas_utilizadas: z.array(z.string()).optional(),
		peso_carga_t: z.number().optional(),
		contrapesos_t: z.number().optional(),
		radio_m: z.number().optional(),
		altura_m: z.number().optional(),
		plumin_m: z.number().optional(),
		plumin_fijo_m: z.number().optional(),
		plumin_abatible_m: z.number().optional(),
		plumin_arriostrado_m: z.number().optional(),
		pluma_m: z.number().optional(),
		href: z.string().url().optional(),
		imagenes,
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: z.object({
		titulo: z.string(),
		resumen: z.string(),
		orden: z.number().default(0),
		fecha: z.coerce.date().optional(),
		imagenes,
		documentos: z
			.array(z.object({ titulo: z.string(), archivo: z.string() }))
			.default([]),
	}),
});

export const collections = { flota, maniobras, blog };
