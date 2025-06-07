// File: src/services/motifService.js
const { data } = require('../data/dictionary');
const Fuse = require('fuse.js');
const Boom = require('@hapi/boom');

class MotifService {
  constructor() {
    // Setup fuzzy search dengan Fuse.js
    this.fuseOptions = {
      keys: ['name', 'provinsi', 'description'],
      threshold: 0.4, // Sensitivity level (0 = exact match, 1 = match anything)
      includeScore: true,
      minMatchCharLength: 2
    };
    
    // Convert data object to array for searching
    this.motifArray = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    
    this.fuse = new Fuse(this.motifArray, this.fuseOptions);
  }

  async getAllMotifs(page = 1, limit = 10, provinsi = null) {
    try {
      let motifs = this.motifArray;

      // Filter by provinsi if provided
      if (provinsi) {
        motifs = motifs.filter(motif => 
          motif.provinsi.toLowerCase().includes(provinsi.toLowerCase())
        );
      }

      // Pagination
      const total = motifs.length;
      const offset = (page - 1) * limit;
      const paginatedMotifs = motifs.slice(offset, offset + limit);

      return {
        data: paginatedMotifs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: offset + limit < total,
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Get all motifs error:', error);
      throw Boom.internal('Failed to get motifs');
    }
  }

  async getMotifById(id) {
    try {
      const motif = data[id];
      
      if (!motif) {
        throw Boom.notFound('Motif not found');
      }

      return {
        id,
        ...motif
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Get motif by ID error:', error);
      throw Boom.internal('Failed to get motif');
    }
  }

  async searchMotifs(query, limit = 10) {
    try {
      if (!query || query.trim().length < 2) {
        throw Boom.badRequest('Search query must be at least 2 characters');
      }

      const searchResults = this.fuse.search(query, { limit });
      
      const results = searchResults.map(result => ({
        ...result.item,
        relevanceScore: Math.round((1 - result.score) * 100) // Convert to percentage
      }));

      return {
        data: results,
        query,
        totalResults: results.length
      };
    } catch (error) {
      if (error.isBoom) {
        throw error;
      }
      
      console.error('Search motifs error:', error);
      throw Boom.internal('Failed to search motifs');
    }
  }

  async getMotifsByProvinsi() {
    try {
      const groupedMotifs = {};
      
      this.motifArray.forEach(motif => {
        const provinsi = motif.provinsi;
        
        if (!groupedMotifs[provinsi]) {
          groupedMotifs[provinsi] = [];
        }
        
        groupedMotifs[provinsi].push({
          id: motif.id,
          name: motif.name,
          description: motif.description,
          occasion: motif.occasion,
          link_shop: motif.link_shop,
          link_image: motif.link_image
        });
      });

      // Convert to array format with count
      const result = Object.keys(groupedMotifs).map(provinsi => ({
        provinsi,
        count: groupedMotifs[provinsi].length,
        motifs: groupedMotifs[provinsi]
      }));

      // Sort by count descending
      result.sort((a, b) => b.count - a.count);

      return result;
    } catch (error) {
      console.error('Get motifs by provinsi error:', error);
      throw Boom.internal('Failed to get motifs by provinsi');
    }
  }

  async getProvinsiList() {
    try {
      const provinsiSet = new Set();
      
      this.motifArray.forEach(motif => {
        provinsiSet.add(motif.provinsi);
      });

      const provinsiList = Array.from(provinsiSet).sort();
      
      return provinsiList.map(provinsi => {
        const count = this.motifArray.filter(motif => motif.provinsi === provinsi).length;
        return {
          name: provinsi,
          count
        };
      });
    } catch (error) {
      console.error('Get provinsi list error:', error);
      throw Boom.internal('Failed to get provinsi list');
    }
  }

  // Helper method untuk mendapatkan random motifs
  async getRandomMotifs(count = 5) {
    try {
      const shuffled = [...this.motifArray].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Get random motifs error:', error);
      throw Boom.internal('Failed to get random motifs');
    }
  }

  // Helper method untuk mendapatkan motifs populer (berdasarkan link_shop yang ada)
  async getPopularMotifs(limit = 10) {
    try {
      // Filter motifs yang memiliki link_shop (dianggap populer)
      const popularMotifs = this.motifArray
        .filter(motif => motif.link_shop && motif.link_shop.trim() !== '')
        .slice(0, limit);

      return popularMotifs;
    } catch (error) {
      console.error('Get popular motifs error:', error);
      throw Boom.internal('Failed to get popular motifs');
    }
  }
}

module.exports = new MotifService();