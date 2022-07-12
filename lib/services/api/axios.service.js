import axios from 'axios';

export default class AxiosService {
  constructor() {
    this.apiEndpoint = '/';
  }

  axiosInstance = (payloadType = 'json-payload') => {
    const devURL = 'http://localhost:8000/api/v1';
    const prodURL = 'https://sisig-barn-app.pwnp-ws.com/public/api/v1';

    const axiosBaseURL = prodURL;

    let instance = axios.create({
      baseURL: axiosBaseURL,
      headers:
        payloadType === 'file-payload'
          ? {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            }
          : {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
    });

    return instance;
  };
}
