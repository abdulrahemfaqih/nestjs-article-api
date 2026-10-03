/**
 * Optimize image URLs (especially Cloudinary) for fast delivery.
 * Automatically enables modern formats (WebP/AVIF), auto compression, and resizing.
 *
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options
 * @param {number} [options.width=800] - Max width
 * @param {string} [options.crop='limit'] - Cloudinary crop mode
 * @returns {string} Optimized URL
 */
export function optimizeImageUrl(url, { width = 800, crop = 'limit' } = {}) {
  if (!url || typeof url !== 'string') return '';

  // Cloudinary optimization
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Avoid double transformations
    if (url.includes('/f_auto')) return url;

    const transformation = `f_auto,q_auto,w_${width},c_${crop}`;
    return url.replace('/upload/', `/upload/${transformation}/`);
  }

  return url;
}
