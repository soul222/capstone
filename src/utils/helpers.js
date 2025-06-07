// File: src/utils/helpers.js
const crypto = require('crypto');

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a unique filename
 * @param {string} originalName - Original filename
 * @param {string} userId - User ID
 * @returns {string} Unique filename
 */
const generateUniqueFilename = (originalName, userId) => {
  const timestamp = Date.now();
  const randomString = generateRandomString(8);
  const extension = originalName.split('.').pop();
  return `${userId}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Validate image file type
 * @param {string} filename - Filename
 * @returns {boolean} Whether file is valid image
 */
const isValidImageType = (filename) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const extension = filename.split('.').pop().toLowerCase();
  return validExtensions.includes(extension);
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate base64 image string
 * @param {string} base64String - Base64 encoded image
 * @returns {boolean} Whether string is valid base64 image
 */
const isValidBase64Image = (base64String) => {
  try {
    // Check if string starts with valid image data URL
    const validPrefixes = [
      'data:image/jpeg;base64,',
      'data:image/jpg;base64,',
      'data:image/png;base64,',
      'data:image/gif;base64,',
      'data:image/webp;base64,'
    ];
    
    const hasValidPrefix = validPrefixes.some(prefix => 
      base64String.startsWith(prefix)
    );
    
    if (!hasValidPrefix) {
      return false;
    }
    
    // Extract base64 data
    const base64Data = base64String.split(',')[1];
    
    // Validate base64 format
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(base64Data);
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize string for database storage
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Create pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} Pagination metadata
 */
const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: offset + limit < total,
    hasPrevPage: page > 1,
    startIndex: offset + 1,
    endIndex: Math.min(offset + limit, total)
  };
};

/**
 * Format date to Indonesian locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate time ago from date
 * @param {Date|string} date - Date to calculate from
 * @returns {string} Time ago string
 */
const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) {
    return 'Baru saja';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return formatDate(date);
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {object} details - Additional error details
 * @returns {object} Error response object
 */
const createErrorResponse = (message, statusCode = 500, details = null) => {
  const response = {
    status: false,
    message,
    statusCode
  };
  
  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }
  
  return response;
};

/**
 * Generate success response
 * @param {string} message - Success message
 * @param {object} data - Response data
 * @param {object} meta - Additional metadata
 * @returns {object} Success response object
 */
const createSuccessResponse = (message, data = null, meta = null) => {
  const response = {
    status: true,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (meta !== null) {
    response.meta = meta;
  }
  
  return response;
};

/**
 * Sleep function for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  generateRandomString,
  generateUniqueFilename,
  isValidImageType,
  formatFileSize,
  isValidBase64Image,
  sanitizeString,
  createPaginationMeta,
  formatDate,
  timeAgo,
  isValidEmail,
  createErrorResponse,
  createSuccessResponse,
  sleep
};