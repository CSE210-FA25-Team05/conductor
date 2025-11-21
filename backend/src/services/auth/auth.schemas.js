export const UpdateProfileParams = {
  type: 'object',
  properties: {
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    pronouns: { type: 'string' },
  },
};

export const UserProfile = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    pronouns: { type: 'string' },
    global_role: { type: 'string' },
    is_profile_complete: { type: 'boolean' },
  },
  required: [
    'id',
    'email',
    'first_name',
    'last_name',
    'pronouns',
    'global_role',
    'is_profile_complete',
  ],
};
