'use strict';

/**
 * Auth Permissions
 *
 * Permission check helpers for user resource access.
 * Handles authorization for viewing/editing user profiles and related operations.
 */

class AuthPermissions {
  constructor(authRepo) {
    this.authRepo = authRepo;
  }

  /**
   * Check if a user can view another user's profile.
   *
   * Rules:
   * - Users can always view their own profile
   * - Professors can view any user's profile
   * - Other users cannot view profiles of other users
   *
   * @param {number} actorUserId - ID of the user making the request
   * @param {number} targetUserId - ID of the user whose profile is being accessed
   * @returns {Promise<boolean>} true if allowed, false otherwise
   */
  async canViewUserProfile(actorUserId, targetUserId) {
    if (actorUserId === targetUserId) {
      return true;
    }

    const actor = await this.authRepo.getUserById(actorUserId, {
      select: { global_role: true },
    });

    if (!actor) {
      return false;
    }

    // Professors can view any user's profile
    return actor.global_role === 'professor';
  }

  /**
   * Check if a user can edit another user's profile.
   *
   * Rules:
   * - Users can always edit their own profile
   * - Other users cannot edit profiles of other users
   *
   * @param {number} actorUserId - ID of the user making the request
   * @param {number} targetUserId - ID of the user whose profile is being edited
   * @returns {Promise<boolean>} true if allowed, false otherwise
   */
  async canEditUserProfile(actorUserId, targetUserId) {
    if (actorUserId === targetUserId) {
      return true;
    }

    return false;
  }

  /**
   * Check if a user has a specific global role.
   *
   * @param {number} userId - ID of the user
   * @param {string} role - Role to check (e.g., 'professor', 'student', 'admin')
   * @returns {Promise<boolean>} true if user has the role, false otherwise
   */
  async isGlobalRole(userId, role) {
    const user = await this.authRepo.getUserById(userId, {
      select: ['global_role'],
    });

    if (!user) {
      return false;
    }

    return user.global_role === role;
  }

  /**
   * Check if a user is a professor.
   *
   * @param {number} userId - ID of the user
   * @returns {Promise<boolean>} true if user is a professor, false otherwise
   */
  async isProfessor(userId) {
    return this.isGlobalRole(userId, 'professor');
  }

  /**
   * Check if a user is a student.
   *
   * @param {number} userId - ID of the user
   * @returns {Promise<boolean>} true if user is a student, false otherwise
   */
  async isStudent(userId) {
    return this.isGlobalRole(userId, 'student');
  }
}

module.exports = AuthPermissions;

