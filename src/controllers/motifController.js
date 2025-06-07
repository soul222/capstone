// File: src/controllers/motifController.js
const motifService = require('../services/motifService');

class MotifController {
  async getAllMotifs(request, h) {
    try {
      const page = parseInt(request.query.page) || 1;
      const limit = parseInt(request.query.limit) || 10;
      const provinsi = request.query.provinsi;

      const result = await motifService.getAllMotifs(page, limit, provinsi);

      return h.response({
        status: true,
        message: 'Motifs retrieved successfully',
        ...result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async getMotifById(request, h) {
    try {
      const { id } = request.params;
      const motif = await motifService.getMotifById(id);

      return h.response({
        status: true,
        message: 'Motif retrieved successfully',
        data: motif
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async searchMotifs(request, h) {
    try {
      const { q: query } = request.query;
      const limit = parseInt(request.query.limit) || 10;

      const result = await motifService.searchMotifs(query, limit);

      return h.response({
        status: true,
        message: 'Search completed successfully',
        ...result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async getMotifsByProvinsi(request, h) {
    try {
      const result = await motifService.getMotifsByProvinsi();

      return h.response({
        status: true,
        message: 'Motifs by provinsi retrieved successfully',
        data: result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }

  async getProvinsiList(request, h) {
    try {
      const result = await motifService.getProvinsiList();

      return h.response({
        status: true,
        message: 'Provinsi list retrieved successfully',
        data: result
      }).code(200);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MotifController();