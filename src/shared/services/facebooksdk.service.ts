export const initFacebookSdk = () => {
  console.log('kdnsk');
  return new Promise<void>((resolve, reject) => {
    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId: '1473906526300403',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v19.0',
      });
      resolve();
    };
  });
};

export const getFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    (window as any).FB.getLoginStatus((response: any) => {
      resolve(response);
    });
  });
};

export const fbLogin = () => {
  return new Promise((resolve, reject) => {
    (window as any).FB.login((response: any) => {
      resolve(response);
    });
  });
};
