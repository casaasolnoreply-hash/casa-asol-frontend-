// El logo subido vive en un lienzo cuadrado con mucho relleno transparente
// alrededor (el archivo real no es cuadrado) — por eso, mostrado tal cual,
// se ve chiquito y descentrado dentro de su caja. Esta transformación de
// Cloudinary recorta ese relleno sobrante en el momento, sin tocar el
// archivo original ni subir nada de nuevo.
export function trimLogo(url) {
  if (!url || typeof url !== "string" || !url.includes("/upload/")) return url;
  if (url.includes("/upload/e_trim")) return url;
  return url.replace("/upload/", "/upload/e_trim/");
}
