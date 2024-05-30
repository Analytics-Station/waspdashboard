export const getFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    (window as any).FB.getLoginStatus((response: any) => {
      resolve(response);
    });
  });
};

export const fbLogin = () => {
  return new Promise((resolve, reject) => {
    (window as any).FB.login(
      (response: any) => {
        resolve(response);
      },
      {
        config_id: '778306407104821', // configuration ID obtained in the previous step goes here
        response_type: 'code', // must be set to 'code' for System User access token
        override_default_response_type: true,
      }
    );
  });
};
