import axios from 'axios';

export default {
  setupInterceptors: async () => {
    await axios.interceptors.request.use(
      async (config) => {
        const requestConfig = config;
        requestConfig.headers['Content-Type'] = 'application/json';
        requestConfig.headers['Access-Key'] = 'AE698wLwHGPLvtuzF46V4P2h4yh3ru2MmkBKpsEA7bzQSHjQ3F';
        requestConfig.headers.Authorization = 'Bearer aBXLkw4RV3J7bNxMIKD2adZnahrnJB';
        
        const token = await localStorage.getItem('token');
        if (token) requestConfig.headers['x-access-token'] = `${token}`; // eslint-disable-line
        return requestConfig;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    // axios.interceptors.response.use(response => response, (error) => {
    //   console.log(error, 'interceptor errorrrr');
    //   return Promise.reject(error.response);
    // });
  },
};
