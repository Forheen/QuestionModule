module.exports = {
  apps: [
    {
      name: "fms-web",
      script: "npx",
      args: ["serve", "-s", "dist", "-l", "7010"], // ✅ Pass arguments as an array
      env: {
        NODE_ENV: "production",
VITE_BASE_URL=process.env.VITE_BASE_URL ,
VITE_ADMIN_LOGIN=process.env.VITE_ADMIN_LOGIN ,
VITE_SUPERADMIN_LOGIN=process.env.VITE_SUPERADMIN_LOGIN, 
VITE_USER_LOGIN=process.env.VITE_USER_LOGIN ,
VITE_CREATE_FORM=process.env.VITE_CREATE_FORM,
VITE_PRODUCTS_ENDPOINT=process.env.VITE_PRODUCTS_ENDPOINT ,
VITE_SUBMIT_FORM=process.env.VITE_SUBMIT_FORM ,
VITE_GET_FORM=process.env.VITE_GET_FORM ,
VITE_GETALL_FORMS=process.env.VITE_GETALL_FORMS ,
VITE_GETALL_SUBMISSIONS=process.env.VITE_GETALL_SUBMISSIONS ,
VITE_GET_REPORT_BY_PRODUCT_UUID=process.env.VITE_GET_REPORT_BY_PRODUCT_UUID ,
VITE_GET_REPORT_BY_PRODUCT_UUID_AND_DATE=process.env.VITE_GET_REPORT_BY_PRODUCT_UUID_AND_DATE
      }
    }
  ]
};

