/**
 * Role mapping utilities for the application
 * Maps backend API roles to frontend dashboard types
 */

/**
 * Check if role is a student/committee role
 * @param {string} role - User role from API
 * @returns {boolean}
 */
export const isStudentRole = (role) => {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === 'lead' || normalizedRole === 'chairperson';
};

/**
 * Check if role is a teacher/faculty role
 * @param {string} role - User role from API
 * @returns {boolean}
 */
export const isTeacherRole = (role) => {
  const normalizedRole = role?.toLowerCase();
  return (
    normalizedRole === 'faculty coordinator' ||
    normalizedRole === 'tpo' ||
    normalizedRole === 'vice principal' ||
    normalizedRole === 'principal' ||
    normalizedRole === 'teacher'
  );
};

/**
 * Check if role is admin
 * @param {string} role - User role from API
 * @returns {boolean}
 */
export const isAdminRole = (role) => {
  const normalizedRole = role?.toLowerCase();
  return normalizedRole === 'admin';
};

/**
 * Get dashboard path for a given role
 * @param {string} role - User role from API
 * @returns {string} Dashboard path
 */
export const getDashboardPath = (role) => {
  if (isStudentRole(role)) {
    return '/dashboard';
  }
  if (isTeacherRole(role)) {
    return '/teacher-dashboard';
  }
  if (isAdminRole(role)) {
    return '/admin';
  }
  return '/dashboard'; // default
};

/**
 * Get menu type for sidebar based on role
 * @param {string} role - User role from API
 * @returns {string} Menu type ('committee', 'teacher', or 'admin')
 */
export const getMenuType = (role) => {
  if (isStudentRole(role)) {
    return 'committee';
  }
  if (isTeacherRole(role)) {
    return 'teacher';
  }
  if (isAdminRole(role)) {
    return 'admin';
  }
  return 'committee'; // default
};

/**
 * Role display names mapping
 */
export const ROLE_DISPLAY_NAMES = {
  'lead': 'Lead',
  'chairperson': 'Chairperson',
  'faculty coordinator': 'Faculty Coordinator',
  'tpo': 'TPO',
  'vice principal': 'Vice Principal',
  'principal': 'Principal',
  'teacher': 'Teacher',
  'admin': 'Admin'
};

/**
 * Get display name for role
 * @param {string} role - User role from API
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role) => {
  const normalizedRole = role?.toLowerCase();
  return ROLE_DISPLAY_NAMES[normalizedRole] || role;
};
