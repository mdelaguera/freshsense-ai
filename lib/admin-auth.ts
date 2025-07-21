/**
 * Admin authentication utilities
 * Restricts admin panel access to authorized users only
 */

// Authorized admin emails
const ADMIN_EMAILS = [
  'michael.delaguera@gmail.com'
]

/**
 * Checks if a user email is authorized for admin access
 * @param email The user's email address
 * @returns boolean indicating if user has admin access
 */
export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase().trim())
}

/**
 * Admin access error for unauthorized users
 */
export class AdminAccessError extends Error {
  constructor(message = 'Unauthorized: Admin access required') {
    super(message)
    this.name = 'AdminAccessError'
  }
}

/**
 * Validates admin access and throws error if unauthorized
 * @param email The user's email address
 * @throws AdminAccessError if user is not authorized
 */
export function requireAdminAccess(email: string | null | undefined): void {
  if (!isAdminUser(email)) {
    throw new AdminAccessError()
  }
}

/**
 * Mock user session for demo purposes
 * In production, this would integrate with your auth system
 */
export function getCurrentUserEmail(): string | null {
  // For demo purposes, return the admin email
  // In production, this would come from your authentication system
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userEmail') || 'michael.delaguera@gmail.com'
  }
  return 'michael.delaguera@gmail.com'
}

/**
 * Sets the current user email (for demo purposes)
 * @param email The user's email
 */
export function setCurrentUserEmail(email: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userEmail', email)
  }
}

/**
 * Clears the current user session
 */
export function clearUserSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userEmail')
  }
}

/**
 * Admin user interface
 */
export interface AdminUser {
  email: string
  name: string
  role: 'admin'
  permissions: string[]
}

/**
 * Gets admin user info if authorized
 * @param email The user's email
 * @returns AdminUser info or null if not authorized
 */
export function getAdminUserInfo(email: string | null | undefined): AdminUser | null {
  if (!isAdminUser(email)) return null
  
  return {
    email: email!,
    name: email === 'michael.delaguera@gmail.com' ? 'Michael De La Guera' : 'Admin User',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics']
  }
}