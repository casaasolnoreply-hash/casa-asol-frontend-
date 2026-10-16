const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const getToken = () => sessionStorage.getItem("ca-token");

const req = async (method, path, body, requiresAuth = false) => {
  const headers = { "Content-Type": "application/json" };
  if (requiresAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
};

export const api = {
  // Auth
  login:          (user, pass) => req("POST", "/api/auth/login",    { user, pass }),
  loginWithGoogle:(payload)    => req("POST", "/api/auth/google",   payload),
  requestAccess:  (data)       => req("POST", "/api/auth/request-access", data),
  forgotPassword: (email)      => req("POST", "/api/auth/forgot-password", { email }),
  me:             ()           => req("GET",  "/api/auth/me",       undefined, true),
  updateProfile:  (data)       => req("PUT",  "/api/auth/profile",  data,      true),

  // Roles
  getPublicRoles:         ()               => req("GET", "/api/roles/public"),
  getRoles:               ()               => req("GET", "/api/roles", undefined, true),
  updateRolePermissions:  (name, permissions) => req("PUT", `/api/roles/${name}`, { permissions }, true),
  createRole:             (data)            => req("POST", "/api/roles", data, true),
  deleteRole:             (name)            => req("DELETE", `/api/roles/${name}`, undefined, true),

  // Site data
  getData:        (key)        => req("GET",  `/api/data/${key}`),
  setData:        (key, value) => req("PUT",  `/api/data/${key}`, { value }, true),

  // Messages
  getMessages:    ()    => req("GET",    "/api/messages",             undefined, true),
  createMessage:  (msg) => req("POST",   "/api/messages",             msg),
  markRead:       (id)  => req("PUT",    `/api/messages/${id}/read`,  {}, true),
  markAllRead:    ()    => req("PUT",    "/api/messages/read-all",    {}, true),
  deleteMessage:  (id)  => req("DELETE", `/api/messages/${id}`,       undefined, true),

  // Users (solo admin / desarrollador)
  getUsers:   ()        => req("GET",    "/api/users",         undefined, true),
  createUser: (u)       => req("POST",   "/api/users",         u,         true),
  updateUser: (id, u)   => req("PUT",    `/api/users/${id}`,   u,         true),
  deleteUser: (id)      => req("DELETE", `/api/users/${id}`,   undefined, true),

  // Solicitudes de acceso (solo admin / desarrollador)
  getUserRequests:  ()             => req("GET",  "/api/users/requests",                 undefined, true),
  approveRequest:   (id, data = {}) => req("POST", `/api/users/requests/${id}/approve`,   data,      true),
  rejectRequest:    (id)           => req("POST", `/api/users/requests/${id}/reject`,     {},        true),

  // Estudiantes / beneficiarios
  getBeneficiaries:    (status)     => req("GET",    `/api/beneficiaries${status ? `?status=${status}` : ""}`, undefined, true),
  createBeneficiary:   (data)       => req("POST",   "/api/beneficiaries",      data,      true),
  updateBeneficiary:   (id, data)   => req("PUT",    `/api/beneficiaries/${id}`, data,     true),
  deleteBeneficiary:   (id)         => req("DELETE", `/api/beneficiaries/${id}`, undefined, true),

  // Informes periódicos
  getAvailableReportRoles: ()    => req("GET",  "/api/reports/available-roles", undefined, true),
  getReportConfig: (role)        => req("GET",  `/api/reports/config/${role}`, undefined, true),
  getReports:      (role)        => req("GET",  `/api/reports${role ? `?role=${role}` : ""}`, undefined, true),
  createReport:    (data)        => req("POST", "/api/reports",         data,      true),
  updateReport:    (id, data)    => req("PUT",  `/api/reports/${id}`,   data,      true),
  submitReport:    (id)          => req("POST", `/api/reports/${id}/submit`, {},   true),
  acceptReport:    (id)          => req("POST", `/api/reports/${id}/accept`, {},   true),
  returnReport:    (id, comment) => req("POST", `/api/reports/${id}/return`, { comment }, true),
  deleteReport:    (id)          => req("DELETE", `/api/reports/${id}`, undefined, true),

  // Expediente de atenciones
  getAvailableAttentionRoles: ()                 => req("GET",  "/api/attentions/available-roles", undefined, true),
  getAttentionConfig:         (role)             => req("GET",  `/api/attentions/config/${role}`, undefined, true),
  getAttentionSummary:        (params)           => req("GET",  `/api/attentions/summary?${new URLSearchParams(params).toString()}`, undefined, true),
  getAttentions:               (params = {})     => req("GET",  `/api/attentions${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ""}`, undefined, true),
  createAttention:             (data)            => req("POST", "/api/attentions",       data, true),
  updateAttention:             (id, data)        => req("PUT",  `/api/attentions/${id}`, data, true),
  deleteAttention:             (id)              => req("DELETE", `/api/attentions/${id}`, undefined, true),
  getCustomActivityTypes:      ()                 => req("GET",  "/api/attentions/custom-types", undefined, true),
  updateCustomActivityTypes:   (types)            => req("PUT",  "/api/attentions/custom-types", { types }, true),
  getActivityCategoryNames:    ()                 => req("GET",  "/api/attentions/category-names", undefined, true),

  // Editor de documentos (informes trabajados como Word)
  getDocumentsList:        (params = {})       => req("GET",  `/api/documents${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ""}`, undefined, true),
  getOrCreateDocument:     (reportId)          => req("POST", "/api/documents", { reportId }, true),
  getDocumentByReport:     (reportId)          => req("GET",  `/api/documents/by-report/${reportId}`, undefined, true),
  getDocument:             (id)                => req("GET",  `/api/documents/${id}`, undefined, true),
  autosaveDocument:        (id, content)       => req("PATCH", `/api/documents/${id}/autosave`, { content }, true),
  saveDocumentVersion:     (id, content, label) => req("POST", `/api/documents/${id}/versions`, { content, label }, true),
  getDocumentVersions:     (id)                => req("GET",  `/api/documents/${id}/versions`, undefined, true),
  restoreDocumentVersion:  (id, versionId)     => req("POST", `/api/documents/${id}/versions/${versionId}/restore`, {}, true),
  submitDocument:          (id)                => req("POST", `/api/documents/${id}/submit`, {}, true),
  startDocumentReview:     (id)                => req("POST", `/api/documents/${id}/start-review`, {}, true),
  gradeDocument:           (id, score)         => req("POST", `/api/documents/${id}/grade`, { score }, true),
  returnDocument:          (id, comment)       => req("POST", `/api/documents/${id}/return`, { comment }, true),
  getDocumentComments:     (id)                => req("GET",  `/api/documents/${id}/comments`, undefined, true),
  addDocumentComment:      (id, data)          => req("POST", `/api/documents/${id}/comments`, data, true),
  resolveDocumentComment:  (id, commentId, resolved) => req("PATCH", `/api/documents/${id}/comments/${commentId}`, { resolved }, true),
  deleteOriginalDocx:      (id)                => req("DELETE", `/api/documents/${id}/original-docx`, undefined, true),
  uploadDocx: async (id, file) => {
    const token = sessionStorage.getItem("ca-token");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/documents/${id}/upload-docx`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "No se pudo convertir el archivo");
    return data;
  },
};
