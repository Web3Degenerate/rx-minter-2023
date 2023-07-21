## Project Dependencies

1. Axios

2. react-router-dom

3. Bootstrap [for Vite](https://getbootstrap.com/docs/5.3/getting-started/vite/)
    - npm i --save bootstrap @popperjs/core
    - npm i --save-dev sass

4. html2canvas [docs](https://html2canvas.hertzen.com/)
    - npm install --save html2canvas

    - html2canvas [documentation](https://html2canvas.hertzen.com/documentation)
    - html2canvas [minified js](https://html2canvas.hertzen.com/dist/html2canvas.js)


5. ethers (CreateScripts.jsx page uses ethers.utils to format the tokenId that is created from BigNumber to string)
    - From [the ethers.org docs](/https://docs.ethers.org/v5/getting-started/)
    - npm install --save ethers


## App Compile Error (doctors.rxminter.com on Fri 7/21/23) - public path issue

`npm run build --base=/client/`
**Source**: https://axellarsson.com/blog/expected-javascript-module-script-server-response-mimetype-text-html/
**Docs**: https://vitejs.dev/guide/build.html#public-base-path