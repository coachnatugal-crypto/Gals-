import { redirect } from "next/navigation";

/** Ruta antigua → home (todo en una sola página). */
export default function ExperienciasRedirect() {
  redirect("/");
}
