// Admin configuration and utilities
export const ADMIN_EMAIL = 'xyzapplywork@gmail.com';

export const isAdmin = (userEmail: string | null) => {
  return userEmail === ADMIN_EMAIL;
};

export const adminRoles = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  ANALYTICS: 'analytics'
};

export const adminPermissions = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MODERATE_CONTENT: 'moderate_content',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_CONFIG: 'system_config'
};