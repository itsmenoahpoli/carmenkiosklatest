import AxiosService from "lib/services/api/axios.service";
import { httpErrorHandler } from "lib/handlers";

import Swal from "sweetalert2";

export default class EmployeePayslipsService {
  constructor() {
    this.axiosService = new AxiosService();
    this.apiEndpoint = "/employee-payslips";
  }

  async getAll(query) {
    try {
      let response = await this.axiosService
        .axiosInstance()
        .get(this.apiEndpoint + `?q=${query}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async createEmployeePayslip(payload) {
    try {
      let response = await this.axiosService
        .axiosInstance()
        .post(this.apiEndpoint, payload);

      Swal.fire({
        icon: "success",
        title: "Created",
        text: "Payslip data successfully added to database",
        confirmButtonText: "Okay",
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async getEmployeePayslipById(employeeId) {
    try {
      let response = await this.axiosService
        .axiosInstance()
        .get(this.apiEndpoint + `/${employeeId}`);

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async updateEmployeePayslipById(employeeId, payload) {
    try {
      let response = await this.axiosService
        .axiosInstance()
        .patch(this.apiEndpoint + `/${employeeId}`, payload);

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Payslip record data successfully updated from database",
        confirmButtonText: "Okay",
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }

  async deleteEmployeePayslipById(employeeId) {
    try {
      let response = await this.axiosService
        .axiosInstance()
        .delete(this.apiEndpoint + `/${employeeId}`, null, null);

      Swal.fire({
        icon: "warning",
        title: "Deleted",
        text: "Payslip record data successfully deleted from database",
        confirmButtonText: "Okay",
      });

      return response;
    } catch (err) {
      httpErrorHandler(err);
    }
  }
}
