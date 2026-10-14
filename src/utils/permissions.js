// Permisos "escalables" (ver backend/src/config/roles.seed.js): cada
// llave puede valer `true` (todos los roles), un arreglo de nombres
// de rol (algunos en concreto) o `false`/ausente (ninguno).

// ¿Este permiso deja ver/hacer algo, aunque sea sobre un solo rol?
export const hasScope = (permissions, key) => {
  const v = permissions?.[key];
  return v === true || (Array.isArray(v) && v.length > 0);
};

// ¿Este permiso específicamente incluye a `role`?
export const scopeIncludes = (permissions, key, role) => {
  const v = permissions?.[key];
  return v === true || (Array.isArray(v) && v.includes(role));
};
