import AxiosService from 'lib/services/api/axios.service';
import { httpErrorHandler } from 'lib/handlers';

import Swal from 'sweetalert2';

export default class ProductsService {
  constructor() {
    this.axiosService = new AxiosService();
    this.apiEndpoint = '/products';
  }

  async getAll(query) {
    try {
      let response = await this.axiosService.axiosInstance().get(this.apiEndpoint + `?q=${query}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async createProduct(payload) {
    try {
      let formData = new FormData();

      console.log(payload);

      for (let d in payload) {
        formData.append(d, payload[d]);
      }

      let response = await this.axiosService.axiosInstance('file-payload').post(this.apiEndpoint, formData);

      Swal.fire({
        icon: 'success',
        title: 'Created',
        text: 'Product data successfully added to database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async getProductById(productId) {
    try {
      let response = await this.axiosService.axiosInstance().get(this.apiEndpoint + `/${productId}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async updateProductById(productId, payload) {
    try {
      let response = await this.axiosService.axiosInstance().patch(this.apiEndpoint + `/${productId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Product record data successfully updated from database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async deleteProductById(productId) {
    try {
      let response = await this.axiosService.axiosInstance().delete(this.apiEndpoint + `/${productId}`, null, null);

      Swal.fire({
        icon: 'warning',
        title: 'Deleted',
        text: 'Product record data successfully deleted from database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }
}
