import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarkFormBuilder from 'stark-form-builder';
import FormSections from './formschema.json';
import AuthApi from '../helper/authApi';
import Api from '../helper/api';

function Employee() {

  // Variable declarations
  const [defaultValues, updateDefaultValues] = useState({});
  const [options, updateOptions] = useState({});
  const [currentUser, updateCurrentUser] = useState(0);


  // Get user role
  const getUserRole = async () => {
    const roleId = await localStorage.getItem('role');
    updateCurrentUser(Number(roleId));
  };

  useEffect(() => {
    getUserRole();
  }, []);

  // Submit Form
  const submitForm = async (formValues) => {
    console.log(formValues);

    const { data } = await AuthApi.postDataToServer(Api.usersUrl, formValues);
    if (!data) {
      // show error
      return;
    }
    // Perform success actions

  };

  const getCities = async () => {
    const { data } = await AuthApi.getDataFromServer(Api.classesUrl);
    if (!data) {
      // show error
      return;
    }

    const dpOptions = [];
    data.data.map((op) => {
      // Change appropriate keys
      dpOptions.push({ label: op.name, value: op.id });
      return op;
    });
    const allOptions = {
      ...options,
      designation: dpOptions
    };
    updateOptions(allOptions);
  }

  useEffect(() => {
    getCities();
  }, []);


  return (
    <>
      <StarkFormBuilder
        containerClass=''
        formHeaderClass=''
        formSections={FormSections}
        formHeading="Employee Details"
        onFormSubmit={(formValues) => { submitForm(formValues); }}
        options={options}
        callbacks={{}}
        defaultFormValues={defaultValues}
        currentUser={currentUser}
        submitBtnText="Submit"
        showResetBtn={false}
        resetBtnText="Clear"
        btnContainerClass="form-submit-buttons"
        onFormReset={() => {
          console.log('form reset callback')
        }}
      />
    </>

  )
}

export default withRouter(Employee);