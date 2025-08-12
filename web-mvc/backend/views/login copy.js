//web-mvc/backend/views/login.js


function login() {
    let test = '';
    if (import.meta.env.NODE_ENV === 'development') {
        test = '<script type="module" src="/@vite/client"></script>';
        test += '<script type="module" src="/src/login-frontend.js"></script>';
    } else {
        //console.log(import.meta.env.NODE_ENV);
        test = '<script> sao chép built vite /src/login-frontend.js </script>';
    }
    return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Login</h1>
            ${test}
        </body>
        </html>
    `;

}
export {login}