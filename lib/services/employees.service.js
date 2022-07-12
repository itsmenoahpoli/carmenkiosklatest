import AxiosService from 'lib/services/api/axios.service';
import { httpErrorHandler } from 'lib/handlers';

import Swal from 'sweetalert2';

export default class EmployeesService {
  constructor() {
    this.axiosService = new AxiosService();
    this.apiEndpoint = '/employees';
  }

  async getAll(query) {
    try {
      let response = await this.axiosService.axiosInstance().get(this.apiEndpoint + `?q=${query}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async createEmployee(payload) {
    try {
      let response = await this.axiosService.axiosInstance().post(this.apiEndpoint, payload);

      Swal.fire({
        icon: 'success',
        title: 'Created',
        text: 'Employee data successfully added to database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      if (err.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Employee with same name already exist',
          confirmButtonText: 'Okay',
        });
      } else {
        httpErrorHandler(err);
      }
    }
  }

  async getEmployeeById(employeeId) {
    try {
      let response = await this.axiosService.axiosInstance().get(this.apiEndpoint + `/${employeeId}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async updateEmployeeById(employeeId, payload) {
    try {
      let response = await this.axiosService.axiosInstance().patch(this.apiEndpoint + `/${employeeId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Employee record data successfully updated from database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async deleteEmployeeById(employeeId) {
    try {
      let response = await this.axiosService.axiosInstance().delete(this.apiEndpoint + `/${employeeId}`, null, null);

      Swal.fire({
        icon: 'warning',
        title: 'Deleted',
        text: 'Employee record data successfully deleted from database',
        confirmButtonText: 'Okay',
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }
}
