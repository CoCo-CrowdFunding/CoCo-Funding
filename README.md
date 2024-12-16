# CoCo crowdfunding

這是一個關於 CoCo crowdfunding 募資平台的前端專案。

## 目錄

- [CoCo crowdfunding](#coco-crowdfunding)
  - [目錄](#目錄)
  - [demo 影片](#demo-影片)
  - [相關介面](#相關介面)
  - [Built With](#built-with)
  - [安裝與運行](#安裝與運行)
    - [下載專案](#下載專案)
    - [安裝依賴](#安裝依賴)
  - [文件](#文件)
  - [部署](#部署)
    - [HOW TO 部屬](#how-to-部屬)
    - [參考影片](#參考影片)
  - [測試](#測試)
    - [使用套件](#使用套件)
    - [參考資源](#參考資源)
    - [run test](#run-test)
      - [測試文件](#測試文件)
  - [檔案架構說明](#檔案架構說明)
    - [server](#server)
    - [client](#client)
  - [相關資源](#相關資源)
  - [VSCode Extensions (Optional but highly recommended!)](#vscode-extensions-optional-but-highly-recommended)

<p align="right"><a href="#readme-top">back to top</a></p>

## demo 影片

[coco 募資專案 demo](https://youtu.be/g1bSZJwMqJQ?si=dybDBxJLIYw6Z9hy)

## 相關介面

- Homepage
  ![alt](./client/demoImage/截圖%202024-11-17%20凌晨1.32.58.png)
- All proposal page
  ![alt](./client/demoImage/截圖%202024-11-17%20凌晨1.33.25.png)
- Proposal info page
  ![alt](./client/demoImage/螢幕擷取畫面_17-11-2024_13357_localhost.jpeg)
- Proposal editor page（新增提案）
  ![alt](./client/demoImage/截圖%202024-11-26%20凌晨1.40.18.png)
- Proposal funding record page
  ![alt](./client/demoImage/截圖%202024-11-26%20凌晨1.40.31.png)
- Proposal record page
  ![alt](./client/demoImage/截圖%202024-11-26%20凌晨1.40.41.png)
- Update proposal page
  ![alt](./client/demoImage/截圖%202024-11-26%20凌晨1.40.56.png)
- Edit profile page
  ![alt](./client/demoImage/截圖%202024-11-26%20凌晨1.41.07.png)

  <p align="right"><a href="#readme-top">back to top</a></p>

## Built With

![React.js](https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)

| 項目類別                     | 需求內容                           |
| ---------------------------- | ---------------------------------- |
| 網站前端(Front End)          | React.js(JavaScript)、Tailwind CSS |
| 前端狀態管理                 | Redux                              |
| 網站後端(Back End)           | Express、node.js                   |
| 資料庫(Database)             | MongoDB                            |
| 版本控制與程式碼託管平台     | Git、GitHub                        |
| UI/UX 設計(Interface Design) | Figma                              |
| API 測試(API Testing)        | Postman                            |

<p align="right"><a href="#readme-top">back to top</a></p>

## 安裝與運行

### 下載專案

首先，從 GitHub 下載此專案：

```bash
git clone git@github.com:CoCo-CrowdFunding/CoCo-Funding.git
cd server
```

### 安裝依賴

使用 npm 安裝所需的依賴：

```bash
npm install
```

In `./server/`, rename `.env.example` to `.env` and then place those three variables.
Default port is 8080.
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

會出現以下程式碼代表有成功執行

```js
Connecting to MongoDB...
Using URI: mongodb+srv://lydia0492302209:lydia2302209@cluster0.cbpm1.mongodb.net/Crowdfunding_Platform?retryWrites=true&w=majority&appName=Cluster0
(node:45637) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
(Use `node --trace-warnings ...` to show where the warning was created)
(node:45637) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
Server is running on port 8080
已成功連接到 MongoDB
MongoDB connected! Connected to Crowdfunding_Platform
```

在開一個終端機，切到前端的資料夾

```bash
cd client
```

使用 npm 安裝所需的依賴：

```bash
npm install
```

到時機密資訊不會上傳到 github，所以.gitignore 會隱藏敏感資訊
In `./client/`, rename `.env.example` to `.env` and then place those three variables.
Default port is 3000.
If don't have `.env.example` ,just create `.env` in files.

```javascript
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_SERVER_URL=http://localhost:8080

// REACT_APP_API_URL=https://coco-442901.de.r.appspot.com/api
// REACT_APP_SERVER_URL=https://coco-442901.de.r.appspot.com

```

註：未來若是有部署，則要換部屬的 IP

在開發模式下運行專案：

```bash
npm run start
```

打開瀏覽器並訪問 http://localhost:3000 查看應用程式。

<p align="right"><a href="#readme-top">back to top</a></p>

## 文件

- [需求文件](/info/軟體需求分析文件.pdf)
- [物件設計文件](/info/物件設計文件.pdf)
- [軟體設計規格書](/info/軟體設計規格書.pdf)
- [軟體專案管理規劃文件](/info/軟體專案管理規劃文件.pdf)

## 部署

要先改 ip，前端的 ip 位置要改成伺服器的

![截圖 2024-12-12 上午10.30.59.png](./info/截圖%202024-12-12%20上午10.30.59.png)

bulid 前端

```jsx
cd frontend
npm run build
```

前端會有 build 好的文件，把 build 的文件複製到後端

![截圖 2024-12-12 上午10.32.51.png](./info/截圖%202024-12-12%20上午10.32.51.png)

後端建立 public 資料夾

![截圖 2024-12-12 上午10.34.00.png](./info/截圖%202024-12-12%20上午10.34.00.png)

建立 app.yaml

```jsx
runtime: nodejs18

env: standard

env_variables:
  MONGO_URI: "mongodb+srv://lydia0492302209:lydia2302209@cluster0.cbpm1.mongodb.net/Crowdfunding_Platform?retryWrites=true&w=majority&appName=Cluster0"
  port: 8080

handlers:
  # 服務靜態資源
  - url: /static
    static_dir: public/static

  # 服務 index.html
  - url: /
    static_files: public/index.html
    upload: public/index.html

  # # 讓 Express 處理其他請求
  - url: /.*
    script: auto

```

後端 index.js 檔案，主要家粉紅底的程式碼

```jsx
const cors = require("cors");
require("dotenv").config(); // 載入環境變數
const express = require("express");

const connectDB = require("./config/database");
require("dotenv").config();
const path = require("path");
const app = express();
const proposalRoutes = require("./routes/proposalRoutes"); // 引入路由
const commentRoutes = require("./routes/commentRoutes"); // 引入路由
const userRoutes = require("./routes/userRoutes"); // 引入路由
const adminRoutes = require("./routes/adminRoutes"); // 引入路由
const paymentRoutes = require("./routes/paymentRoutes"); // 引入路由
const chatbotRoutes = require("./routes/chatbotRoutes"); // 引入路由

app.use(express.json()); // 要加這行才可以做 POST 請求啦!!!
app.use(cors()); // 跨來源資源共用

// 連接到 MongoDB
connectDB();

// 設定基本路由
app.get("/", (req, res) => {
  res.send("Hello, World!"); // 或您可以設定為其他回應
});

// 使用 proposalRoutes 並掛載到 /api
app.use("/api", proposalRoutes);
app.use("/api", commentRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", paymentRoutes);
app.use("/api", chatbotRoutes);

// 設定上傳檔案的路徑
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static("public")); // Serve static files from the 'public' folder

app.get("*", (req, res) => {
  console.log(path.join(__dirname, "build", "index.html"));

  res.sendFile(__dirname, "build", "index.html");
});

// 啟動伺服器並監聽 8080 埠
// 在測試環境中不要啟動服務器
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
```

### HOW TO 部屬

前置作業：

要先下載 gcloud 的專屬指令碼，可以參考影片

切到後端資料夾

```bash
cd backend
```

部屬指令

```bash
gcloud app deploy
```

### 參考影片

- [Run your React app on Google Cloud](https://youtu.be/NMnKGHgw8aM?si=UxH8HZgpcTSayIGP)
- [部屬 GCP](https://www.notion.so/GCP-app-engin-15a8c31e994280588f9ad33da447209c)

<p align="right"><a href="#readme-top">back to top</a></p>

## 測試

前期環境架設最麻煩，後來是建立假資料庫來執行後端 API 的測試。

- 單元測試
- 整合測試
- 壓力測試

#### 使用套件

- [JEST](https://jestjs.io/docs/getting-started)
- [Supertest](https://www.npmjs.com/package/supertest)
- [K6](https://grafana.com/docs/k6/latest/)

#### 參考資源

- [mohamedlotfe/unit-testing-api-nodejs-jest](https://github.com/mohamedlotfe/unit-testing-api-nodejs-jest/blob/main/tests/server.test.js)
- [[第三週]JavaScript — 測試框架 Jest](https://miahsuwork.medium.com/%E7%AC%AC%E4%B8%89%E9%80%B1-javascript-%E6%B8%AC%E8%A9%A6%E6%A1%86%E6%9E%B6-jest-eccf0ff2cea2)
- [K6 壓力測試工具介紹](https://wayne-blog.com/2023-04-11/k6-introduction/)

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
<p align="right"><a href="#readme-top">back to top</a></p>

## 檔案架構說明

### server

```
├── README.md
├── app.yaml (部署用)
├── controllers
│   ├── AdminController.js
│   ├── CommentController.js
│   ├── PaymentController.js
│   ├── ProposalController.js
│   ├── UserController.js
│   └── chatbotController.js
├── index.js
├── model（資料庫的schema）
│   ├── admin-model.js
│   ├── comment-model.js
│   ├── proposal-model.js
│   └── user-model.js
├── package-lock.json
├── package.json
├── routes（後端路由）
│   ├── adminRoutes.js
│   ├── chatbotRoutes.js
│   ├── commentRoutes.js
│   ├── paymentRoutes.js
│   ├── proposalRoutes.js
│   └── userRoutes.js
└── tests （測試）
    ├── IT（整合）
    │   ├── 1.js
    │   ├── 10.js
    │   ├── 11.js
    │   ├── 2.js
    │   ├── 3.js
    │   ├── 4.js
    │   ├── 5.js
    │   ├── 6.js
    │   ├── 7.js
    │   ├── 8.js
    │   └── 9.js
    ├── K6（壓力）
    │   ├── create_proposal_test.js
    │   ├── get_all_proposal_test.js
    │   ├── login_test.js
    │   ├── proposal_k6_test_1.js
    │   ├── proposal_k6_test_2.js
    │   ├── proposal_k6_test_3.js
    │   ├── user_k6_test_1.js
    │   ├── user_k6_test_2.js
    │   ├── user_k6_test_3.js
    │   ├── user_k6_test_4.js
    │   └── user_k6_test_5.js
    ├── admin.test.js（單元）
    ├── chatbot.test.js（單元）
    ├── comment.test.js（單元）
    ├── proposal.test.js（單元）
    └── user.test.js（單元）
```

### client

```
.
├── README.md
├── app.yaml (部署用)
├── package-lock.json
├── package.json
├── public
│   ├── index.html
│   ├── logo192.png
│   └── main-icon.svg
├── src
│   ├── App.jsx
│   ├── asset
│   │   ├── 285083_0.jpg
│   │   ├── 285505_0.jpg
│   │   └── main-icon.svg
│   ├── components
│   │   ├── AllProposalpage
│   │   │   ├── AllProposalList.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── Chatbot.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Nav.jsx
│   │   ├── Title.jsx
│   │   ├── UserInfopage
│   │   │   ├── FundingRecordTable.jsx
│   │   │   └── ProposalTable.jsx
│   │   └── homepage
│   │       ├── Dropdown.jsx
│   │       ├── ProposalCard.jsx
│   │       └── ProposalList.jsx
│   ├── features （狀態變數整理及API）
│   │   ├── admin
│   │   │   ├── adminService.js
│   │   │   └── adminSlice.js
│   │   ├── api
│   │   │   └── index.js
│   │   ├── auth
│   │   │   └── authSlice.js
│   │   ├── chatbot
│   │   │   ├── chatbotService.js
│   │   │   └── chatbotSlice.js
│   │   ├── comment
│   │   │   ├── commentService.js
│   │   │   └── commentSlice.js
│   │   ├── proposal
│   │   │   ├── proposalService.js
│   │   │   └── proposalSlice.js
│   │   └── user
│   │       ├── userService.js
│   │       └── userSlice.js
│   ├── index.css
│   ├── index.js
│   ├── pages
│   │   ├── AdminLogin.jsx
│   │   ├── AdminRegister.jsx
│   │   ├── AdminReviewPage.jsx
│   │   ├── AllProposalpage.jsx
│   │   ├── CreateProposal.jsx
│   │   ├── EditProfile.jsx
│   │   ├── EditProposal.jsx
│   │   ├── Homepage.jsx
│   │   ├── Login.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── ProposalInfopage.jsx
│   │   ├── Register.jsx
│   │   └── layout
│   │       ├── Button.jsx
│   │       ├── Checkbox.jsx
│   │       ├── Input.jsx
│   │       ├── Loading.jsx
│   │       └── Title.jsx
│   ├── setupTest.js
│   ├── store.js
│   └── utils
│       ├── authHeader.js
│       └── localStorage.js
└── tailwind.config.js
```

<p align="right"><a href="#readme-top">back to top</a></p>

## 相關資源

- [MDN Resources for Developers, by Developers](https://developer.mozilla.org/en-US/) - 基本上是必備的，幾乎你想的到的所有網站開發的知識這裡都有。

- [Udemy 2022 網頁開發全攻略(HTML, CSS, JavaScript, React, SQL, Node, more)](https://www.udemy.com/course/html5-css3-z/) - (無業配)網頁全端開發很好的入門磚，老師講得淺顯易懂，等特價的時候差不多三四百塊就買的到，非常划算。

- [2020 iT 邦鐵人賽 成為看起來很強的後端](https://youtube.com/playlist?list=PLS5AiLcCHgNxd341NwuY9EOpVvY5Z8VOs) - 花一個下午的時間就可以大致了解後端藍圖，賺。

- [tailwind css 文件](https://tailwindcss.com/)

- [react 介紹](https://www.youtube.com/live/zqV7NIFGDrQ?si=jAlaqF1uWq1kQVD7)

- [git 相關指令](https://jagged-veil-0e3.notion.site/git-216c171d3a774b3485baa0932aa46b40?pvs=4)

<p align="right"><a href="#readme-top">back to top</a></p>

## VSCode Extensions (Optional but highly recommended!)

| Extenstion Name                        | Description                                                                                                                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prettier - Code formatter              | 文字排版對齊工具，基本上是必備。                                                                                                                                                  |
| GitLens                                | Git 超好用的套件，包含圖形化、比較分支差異等等好處說不完。Student Developer Package 可以免費使用                                                                                  |
| GitHub Copilot or Tabnine AI           | 程式碼自動補齊、生成。前者可以於 Student Developer Package 免費取得，後者有付費與免費版本。                                                                                       |
| WakaTime                               | 紀錄打 code 的時間 ， 免費版最多紀錄兩周 。                                                                                                                                       |
| Git History                            | 查看檔案 Git log、檔案歷史紀錄、比較分支或 commit 紀錄 。                                                                                                                         |
| Dracula Official                       | 好看的 VSCode 主題可以提升生產力。不一定要用這個，有很多不同主題的 extentions 等你去找。                                                                                          |
| Material Icon Theme                    | 好看的 VSCode 圖示可以提升生產力。不一定要用這個，有很多不同圖示的 extentions 等你去找。                                                                                          |
| ESLint                                 | 用於檢查 JavaScript 程式碼是否符合規則(語法檢查、提醒刪除多於程式碼等等)，確保你的程式碼品質在一定的水準之上 。                                                                   |
| ES7+ React/Redux/React-Native snippets | 可以輕鬆地為 React 生成語法和代碼片段。<br/>每次需要創建一個 new component 時，只需編寫 `rce`（對於類組件）或 `rfce` or `rfc`（對於功能組件），打 `rccp` 就可以自動完成元件架構。 |

<p align="right"><a href="#readme-top">back to top</a></p>
