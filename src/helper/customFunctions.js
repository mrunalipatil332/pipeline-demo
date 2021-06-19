import React, { Component } from 'react'; // eslint-disable-line
import AuthApi from './authApi';

class CustomFunctions extends Component {
  jsonParse = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return jsonString;
    }
  };

  validateEmail = (email) => {
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return emailReg.test(email);
  };

  validatePhone = (phone) => {
    var phoneformat = /^\d{10}$/; // eslint-disable-line
    return phone.match(phoneformat);
  };

  validatePrice = (price) => {
    var priceformat = /^\d{1,8}(\.\d{0,2})?$/g; // eslint-disable-line
    return price.match(priceformat);
  };

  loadScript = async (src) => {
    const ele = document.getElementById(src);
    if (ele) {
      ele.remove();
    }
    const script = document.createElement('script');
    script.id = src;
    script.src = src;
    script.type = 'text/javascript';
    script.async = false;
    // script.type = "text/babel";
    // script.type = "text/jsx";
    //  document.getElementsByClassName("wrapper")[0].appendChild(script);
    await document.body.appendChild(script);
  };

  getUserData = async () => {
    try {
      const userdata = await localStorage.getItem('userdata');
      const decodedData = this.jsonParse(userdata);
      return decodedData;
    } catch (err) {
      return null;
    }
  };

  validateAmount = (amount) => {
    const amountFormat = /^[1-9]\d{0,8}(((,\d{3}){1})?(\.\d{0,2})?)$/;
    return amountFormat.test(amount);
  };

  capitalizeFirstLetter = (string) => {
    if(!string) return string;
    
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  checkIfEmpty = (value, type = 'default') => {
    switch (type) {
      case 'A': return (!value || (value && !value.length));
      case 'O': return (!value || (value && !Object.keys(value).length));
      default: return !value;
    }
  };

  cleanObject = (obj) => {
    const cleanedObject = Object.entries(obj).reduce(
      (a, [k, v]) => (v || v === false || v === 0 ? ((a[k] = v), a) : a), // eslint-disable-line
      {},
    );
    return cleanedObject;
  };

  userRestrictions = (element, permittedUsers = [], isLink = false) => {
    const roleId = 1;
    const hasPermissions = permittedUsers && permittedUsers.length && permittedUsers.includes(roleId);
    if (!hasPermissions) return isLink ? 'javascript:void(0)' : '';
    return element;
  };

  generateUrl = (url, urlParams = {}) => {
    const searchParams = new URLSearchParams(
      this.cleanObject(urlParams),
    ).toString();
    let apiEndpoint = url;
    if (!this.checkIfEmpty(urlParams, 'O')) apiEndpoint = `${apiEndpoint}?${searchParams}`;
    return apiEndpoint;
  };

  toLowerCase = (str = '') => {
    return String(str).toLowerCase();
  };

  deepClone = (obj = {}) => {
    return JSON.parse(JSON.stringify(obj));
  };

  /**
   * to bulk delete record which will call prepare url and call get api 
   * @param {*} url 
   * @param {*} urlParams
   * @param {*} type  
   * @param {*} successCallback 
   * @param {*} errorCallback 
   * @returns callback success and error
   */
  deleteBulkRecord = async (url, urlParams = {}, type = 'get', successCallback = null, errorCallback = null) => {
    let buildUrl = url;
    let params = {};
    let callApi = null;
    try {
      switch (type.toLowerCase()) {
        case 'put': {
          const filterParam = this.cleanObject(urlParams);
          params = { buildUrl, filterParam };
          callApi = AuthApi.putDataToServer;
          break;
        }
        case 'post': {
          const filterPostParam = this.cleanObject(urlParams);
          params = { buildUrl, filterPostParam };
          callApi = AuthApi.postDataToServer;
          break;
        }
        case 'get':
        default: {
          callApi = AuthApi.deleteDataFromServer;
          if (!this.checkIfEmpty(urlParams, 'O'))
            buildUrl = this.generateUrl(buildUrl, urlParams);

          params = { buildUrl };
        }
      }
      const { data, message } = await callApi(...Object.values(params));
      if (data && !data.success) {
        if (errorCallback) errorCallback(message);
        return;
      }
      if (successCallback) successCallback(data);
    } catch (e) {
      if (errorCallback) errorCallback(e);
    }
  }

  /**
   * to change status by using put api call
   * @param {*} url 
   * @param {*} urlParams
   * @param {*} type 
   * @param {*} successCallback 
   * @param {*} errorCallback 
   * @returns callback success or error 
   */
  changeStatus = async (url, urlParams = {}, type = 'put', successCallback = null, errorCallback = null) => {
    try {
      if (this.checkIfEmpty(urlParams, 'O'))
        return false;

      const apiCall = (type.toLowerCase() === 'put') ? AuthApi.putDataToServer : AuthApi.postDataToServer;
      const params = this.cleanObject(urlParams);
      const { data, message } = await apiCall(url, params);
      if (data && !data.success) {
        if (errorCallback) errorCallback(message);
        return data;
      }
      if (successCallback) successCallback(data);

      return data;
    } catch (e) {
      if (errorCallback) errorCallback(e);

      return e;
    }
  }

  stringify = (data) => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      return '';
    }
  };

  setLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  getLocalStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return false;
    }
  }

  removeLocalStorage = (key) => {
    try {
      if (typeof key === 'string')
        return localStorage.removeItem(key);

      if (typeof key === 'object') {
        key.map(item => { return this.removeLocalStorage(item); });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

}

export default new CustomFunctions();
