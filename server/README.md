## How to Run in Localhost?

Clone this repository first. If you are our developer, please use SSH.

```Bash
$ git clone git@github.com:CoCo-CrowdFunding/backend.git
$ cd backend
```

Download all backend package.

```Bash
$ npm install
```

In `./backend/`, rename `.env.example` to `.env` and then place those three variables.
Default port is 3000.
If don't have `.env.example` ,just create `.env` in files.

```javascript
PORT=8080
MONGO_URI=mongodb+srv://lydia0492302209:lydia2302209@cluster0.cbpm1.mongodb.net/Crowdfunding_Platform?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=THIS_IS_MY_SECRET
SECRET_KEY=supersecretkey123
// 要注意token有沒有過期
HUGGINGFACE_TOKEN=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
GEMINI_API_KEY=AIzaSyDP-KBgQQ74cTWkd6QYk3P5azEp-zEGzg0

# 區別測試文件
MONGO_URI_test=mongodb+srv://lydia0492302209:lydia2302209@cluster0.cbpm1.mongodb.net/JestDB?retryWrites=true&w=majority&appName=Cluster0
TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzRkYjlhMzcxMjA5ODcwYmY3YjBmNjAiLCJ1c2VybmFtZSI6IjEyMzQ1IiwiaWF0IjoxNzMzMjgyMjgxfQ.5-k9vWx1qsXHWJAjmQI1b8tl6yl_nrs-m10VUgUSwE4

```

Run the backend server in `localhost`.

You can use `nodemon`. When you modified files and save it, server side would reload automatically.

```Bash
$ nodemon index.js
```

If you encounter some errors, you can just using `node` to run.

```
$ node index.js
```

### 測試相關

#### 使用套件

- [JEST](https://jestjs.io/docs/getting-started)
- [Supertest](https://www.npmjs.com/package/supertest)

#### 參考資源

- [mohamedlotfe/unit-testing-api-nodejs-jest](https://github.com/mohamedlotfe/unit-testing-api-nodejs-jest/blob/main/tests/server.test.js)
- [[第三週]JavaScript — 測試框架 Jest](https://miahsuwork.medium.com/%E7%AC%AC%E4%B8%89%E9%80%B1-javascript-%E6%B8%AC%E8%A9%A6%E6%A1%86%E6%9E%B6-jest-eccf0ff2cea2)

### run test

If you want to run test

```
$ npm run test
```

If have fail test
不同檔案之間的測試：Jest 預設會並行運行測試，也就是不同檔案的測試可以同時執行。但運行多個共享資源的測試檔案時，可能會發生衝突（資料出入不一樣）。

使用 --runInBand 讓測試順序執行
如果你希望測試逐一執行（串行執行），可以使用 --runInBand 選項。這在處理並行測試時發生資料庫衝突等問題時非常有用。

```
$ npm test -- --runInBand
```

#### 測試文件

- [測試](https://docs.google.com/document/d/13Ex2MD3jcepX32u_gM5HVTmzI2XGwqzS5baY_puaTO8/edit?tab=t.0)
