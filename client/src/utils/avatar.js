/**
 * Avatar utility using DiceBear API for reliable, professional-looking avatars.
 * Avatar utility using custom local human images.
 */

const DICEBEAR_BASE = 'https://api.dicebear.com/10.x';

/**
 * Avatar utility using custom local human images.
 */

const MALE_AVATARS = [
  '/avatars/male1.jpg',
  '/avatars/male2.jpg',
  '/avatars/male3.avif',
  '/avatars/male4.avif',
  '/avatars/male5.avif',
  '/avatars/male6.avif',
  '/avatars/male7.avif',
  '/avatars/male8.avif',
  '/avatars/male9.avif',
  '/avatars/male10.avif'
];

const FEMALE_AVATARS = [
  '/avatars/female1.jpg',
  '/avatars/female2.avif',
  '/avatars/female3.avif',
  '/avatars/female4.avif',
  '/avatars/female5.avif',
  '/avatars/female6.jpg',
  '/avatars/female7.avif',
  '/avatars/female8.jpg',
  '/avatars/female9.avif',
  '/avatars/female10.jpg'
];

/**
 * Helper to get a stable index based on a string (like a name)
 */
function getStableIndex(str, max) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

/**
 * Generate a default avatar URL. 
 * If gender isn't passed, we fallback to a simple initials avatar.
 * @param {string} name - The user's display name
 * @param {string} gender - Optional gender
 * @returns {string} Avatar URL
 */
export function getDefaultAvatar(name = 'User', gender) {
  if (gender === 'female') {
    return FEMALE_AVATARS[getStableIndex(name, FEMALE_AVATARS.length)];
  } else if (gender === 'male') {
    return MALE_AVATARS[getStableIndex(name, MALE_AVATARS.length)];
  }
  // Fallback if no gender provided
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/10.x/initials/svg?seed=${seed}&backgroundColor=4f46e5,7c3aed,2563eb,0891b2,059669,d97706,dc2626,db2777&fontWeight=600&fontSize=40`;
}

/**
 * Generate a mentor-specific avatar URL.
 * @param {string} name - The mentor's name
 * @param {string} gender - 'male' or 'female'
 * @returns {string} Avatar URL
 */
export function getMentorAvatar(name = 'Mentor', gender = 'male') {
  if (gender === 'female') {
    return FEMALE_AVATARS[getStableIndex(name, FEMALE_AVATARS.length)];
  } else {
    return MALE_AVATARS[getStableIndex(name, MALE_AVATARS.length)];
  }
}

/**
 * List of selectable avatar URLs for profile customization.
 */
export const SELECTABLE_AVATARS = [...MALE_AVATARS.slice(0, 5), ...FEMALE_AVATARS.slice(0, 5)];
