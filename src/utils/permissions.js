// Permisos "escalables" (ver backend/src/config/roles.seed.js): cada
// llave puede valer `true` (todos los roles), un arreglo de nombres
// de rol (algunos en concreto) o `false`/ausente (ninguno).
//
// `fullAccess` es la llave exclusiva del rol "desarrollador" (ver
// roles.seed.js) — su cuenta nunca tiene las llaves individuales
// (verImagenes, verInformes...) guardadas, solo esta. Por eso ambos
// helpers la tratan como un sí a todo: si no fuera así, desarrollador
// quedaría bloqueado de cualquier pantalla que dependa de un permiso
// escalable en vez de depender de isDeveloper en cada lugar que lo usa.
export const hasScope = (permissions, key) => {
  if (permissions?.fullAccess) return true;
  const v = permissions?.[key];
  return v === true || (Array.isArray(v) && v.length > 0);
};

// ¿Este permiso específicamente incluye a `role`?
export const scopeIncludes = (permissions, key, role) => {
  if (permissions?.fullAccess) return true;
  const v = permissions?.[key];
  return v === true || (Array.isArray(v) && v.includes(role));
};
