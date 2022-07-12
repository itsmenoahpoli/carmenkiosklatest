import AxiosService from 'lib/services/api/axios.service';
import { httpErrorHandler } from 'lib/handlers';

import Swal from 'sweetalert2';

export default class ProductCategoriesService {
  constructor() {
    this.axiosService = new AxiosService();
    this.apiEndpoint = '/product-categories';
  }

  async getAll(query) {
    try {
      let response = await this.axiosService.axiosInstance().get(this.apiEndpoint + `?q=${query}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async createCategory(payload) {
    try {
      let response = await this.axiosService.axiosInstance().post(this.apiEndpoint, payload);

      Swal.fire({
        icon: 'success',
        title: 'Created',
        text: 'Category data successfully added to database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      if (err.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Category with same name already exist',
          confirmButtonText: 'Okay',
        });
      } else {
        httpErrorHandler(err);
      }
    }
  }

  async getCategoryById(categoryId) {
    try {
      let response = await this.axiosService.axiosInstance().get(this.apiEndpoint + `/${categoryId}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async updateCategoryById(categoryId, payload) {
    try {
      let response = await this.axiosService.axiosInstance().patch(this.apiEndpoint + `/${categoryId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Category record data successfully updated from database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async deleteCategoryById(categoryId) {
    try {
      let response = await this.axiosService.axiosInstance().delete(this.apiEndpoint + `/${categoryId}`, null, null);

      Swal.fire({
        icon: 'warning',
        title: 'Deleted',
        text: 'Category record data successfully deleted from database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }
}
