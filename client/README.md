# CoCo crowdfunding

這是一個關於 CoCo crowdfunding 募資平台的前端專案。

## 所有頁面

- [x] homepage(熱門的 proposal)
- [x] proposal detail page（提案詳細資訊）
- [x] all proposal page(所有提案列表)
- [x] proposal editor page（新增提案）
- [x] update proposal page(修改提案的頁面)
- [x] create edit delet comment(crud 評論)
- [x] personal file page
- [x] proposal funding record page(贊助紀錄)
- [x] proposal record page(提案紀錄)
- [x] purchase page(付款頁面)
- [x] review proposal page(管理員審核提案)
- [x] login page(登入頁面)
- [x] register page(註冊頁面)
- [x] edit profile page(修改個人資訊頁面)

## API 串接

# adminRoutes

| **完成** | **URL**                                            | **Function 名稱** | **功能**                   |
| -------- | -------------------------------------------------- | ----------------- | -------------------------- |
| [ ]      | `http://localhost:8080/admin_register`             | `router.post`     | Admin 註冊新帳戶           |
| [x]      | `http://localhost:8080/admin_login`                | `router.post`     | Admin 登入，返回 JWT Token |
| [ ]      | `http://localhost:8080/edit`                       | `router.put`      | 編輯當前登入 Admin 的資料  |
| [ ]      | `http://localhost:8080/all`                        | `router.get`      | 獲取所有 Admin 資料        |
| [ ]      | `http://localhost:8080/delete/:id`                 | `router.delete`   | 刪除指定 ID 的 Admin 資料  |
| [x]      | `http://localhost:8080/admin_proposals`            | `router.get`      | 獲得所有未審核的提案       |
| [x]      | `http://localhost:8080/update_proposal_status/:id` | `router.put`      | 審核提案為通過或是不通過   |

# userRoutes

| **完成** | **HTTP Method** | **URL**                                              | **Function 名稱**          | **功能**                                                   |
| -------- | --------------- | ---------------------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| [x]      | POST            | `http://localhost:8080/api/user_register`            | `user_register`            | 用戶註冊，輸入 email、name 和 password，保存用戶到資料庫。 |
| [x]      | POST            | `http://localhost:8080/api/user_login`               | `user_login`               | 用戶登入，驗證 email 和 password，返回 JWT。               |
| [x]      | POST            | `http://localhost:8080/api/user_logout`              | `user_logout`              | 用戶登出，清除令牌並返回成功信息。                         |
| [x]      | PUT             | `http://localhost:8080/api/user_edit`                | `user_edit`                | 更新用戶資料（如 username 和 password）。                  |
| [x]      | PUT             | `http://localhost:8080/api/user_get`                 | `user_get`                 | 獲取當前登入用戶的詳細資料。                               |
| [ ]      | PUT             | `http://localhost:8080/api/user_edit_pwd`            | `user_edit_pwd`            | 用於忘記密碼時，更新用戶密碼。                             |
| [x]      | PUT             | `http://localhost:8080/api/user_get_sponsor_history` | `user_get_sponsor_history` | 獲取用戶的贊助歷史記錄，包括項目詳細信息。                 |
| [x]      | DELETE          | `http://localhost:8080/api/remove_purchase`          | `remove_purchase`          | 處理用戶的退款請求，更新用戶購買記錄和項目數據。           |

# proposalRoutes

| **完成** | **HTTP Method** | **URL**                                                        | **Function 名稱**       | **功能**               |
| -------- | --------------- | -------------------------------------------------------------- | ----------------------- | ---------------------- |
| [x]      | POST            | `http://localhost:8080/api/proposal_add`                       | `proposal_add`          | 新增提案               |
| [x]      | PUT             | `http://localhost:8080/api/proposal_edit/:proposal_id`         | `proposal_edit`         | 修改提案               |
| [x]      | DELETE          | `http://localhost:8080/api/proposal_delete/:proposal_id`       | `proposal_delete`       | 刪除提案               |
| [x]      | GET             | `http://localhost:8080/api/get_all_proposal`                   | `get_all_proposal`      | 取得所有提案           |
| [x]      | GET             | `http://localhost:8080/api/get_proposal_detail/:proposal_id`   | `get_proposal_detail`   | 取得單一提案詳細資料   |
| [ ]      | GET             | `http://localhost:8080/api/get_status/:proposal_id`            | `get_status`            | 查詢提案狀態           |
| [ ]      | PATCH           | `http://localhost:8080/api/edit_status/:proposal_id`           | `edit_status`           | 更改提案狀態(限管理員) |
| [x]      | GET             | `http://localhost:8080/api/get_comments/:proposal_id`          | `get_comments`          | 取得提案留言           |
| [ ]      | GET             | `http://localhost:8080/api/search_proposal`                    | `search_proposal`       | 用關鍵字搜尋提案       |
| [ ]      | GET             | `http://localhost:8080/api/get_proposal_sponsors/:proposal_id` | `get_proposal_sponsors` | 查詢提案的所有贊助者   |
| [x]      | GET             | `http://localhost:8080/api/get_proposal_record/:user_id`       | `get_proposal_record`   | 獲取 user 的提案內容   |

# commentRoutes

| **完成** | **HTTP Method** | **URL**                                                  | **Function 名稱** | **功能**               |
| -------- | --------------- | -------------------------------------------------------- | ----------------- | ---------------------- |
| [x]      | POST            | `http://localhost:8080/api/comment_add`                  | `comment_add`     | 新增留言               |
| [x]      | GET             | `http://localhost:8080/api/get_all_comment/:proposal_id` | `get_all_comment` | 取得某個提案的所有留言 |
| [x]      | DELETE          | `http://localhost:8080/api/comment_delete/:comment_id`   | `comment_delete`  | 刪除留言               |
| [ ]      | POST            | `http://localhost:8080/api/add_rate`                     | `add_rate`        | 設置提案評分           |
| [x]      | GET             | `http://localhost:8080/api/get_rate/:proposal_id`        | `get_rate`        | 查看提案的評分         |

# paymentRoutes

表格內容:
| **完成** | **URL** | **Function 名稱** | **功能** |
| ------- |----------------------|------------------|--------------------------------------
| [x] | `http://localhost:8080/purchase_proposal`| `router.put` | 更新指定支付記錄的狀態 |

# chatbotRoutes

| **完成** | **URL**                           | **Function 名稱** | **功能**         |
| -------- | --------------------------------- | ----------------- | ---------------- |
| [ ]      | `http://localhost:8080/recommend` | `router.post`     | 處理推薦提案     |
| [ ]      | `http://localhost:8080/manual`    | `router.post`     | 查詢操作手冊     |
| [ ]      | `http://localhost:8080/proposal`  | `router.post`     | 查詢提案詳細資訊 |

## 相關介面

- homepage
  ![alt](./demoImage/截圖%202024-11-17%20凌晨1.32.58.png)
- all proposal page
  ![alt](./demoImage/截圖%202024-11-17%20凌晨1.33.25.png)
- proposal info page
  ![alt](./demoImage/螢幕擷取畫面_17-11-2024_13357_localhost.jpeg)
- proposal editor page（新增提案）
  ![alt](./demoImage/截圖%202024-11-26%20凌晨1.40.18.png)
- proposal funding record page
  ![alt](./demoImage/截圖%202024-11-26%20凌晨1.40.31.png)
- proposal record page
  ![alt](./demoImage/截圖%202024-11-26%20凌晨1.40.41.png)
- update proposal page
  ![alt](./demoImage/截圖%202024-11-26%20凌晨1.40.56.png)
- edit profile page
  ![alt](./demoImage/截圖%202024-11-26%20凌晨1.41.07.png)

## 資料夾架構

update:10/20
![截圖 2024-10-20 下午6 45 31](https://github.com/user-attachments/assets/1391052c-a24b-41b8-985d-4071a46cedb0)

## 預計頁面

[頁面相關](https://docs.google.com/document/d/19Wg3VpuLh2v4T2L3F59EqULs4cBKnt_dRgRfQsM5kzc/edit?usp=sharing)

## 使用的語言與框架

- 語言: JavaScript
- 框架: React (使用 Create React App 建立)

## 安裝與運行

### 下載專案

首先，從 GitHub 下載此專案：

```bash
git clone git@github.com:CoCo-CrowdFunding/CoCo-frontend.git
cd CoCo-frontend
```

### 安裝依賴

使用 npm 安裝所需的依賴：

```bash
npm install
```

到時機密資訊不會上傳到 github，所以.gitignore 會隱藏敏感資訊
In `./frontend/`, rename `.env.example` to `.env` and then place those three variables.
Default port is 3000.
If don't have `.env.example` ,just create `.env` in files.

```javascript
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_SERVER_URL=http://localhost:8080
```

### 運行專案

在開發模式下運行專案：

```bash
npm run start
```

打開瀏覽器並訪問 http://localhost:3000 查看應用程式。

### Learning Resources

- [MDN Resources for Developers, by Developers](https://developer.mozilla.org/en-US/) - 基本上是必備的，幾乎你想的到的所有網站開發的知識這裡都有。

- [Udemy 2022 網頁開發全攻略(HTML, CSS, JavaScript, React, SQL, Node, more)](https://www.udemy.com/course/html5-css3-z/) - (無業配)網頁全端開發很好的入門磚，老師講得淺顯易懂，等特價的時候差不多三四百塊就買的到，非常划算。

- [2020 iT 邦鐵人賽 成為看起來很強的後端](https://youtube.com/playlist?list=PLS5AiLcCHgNxd341NwuY9EOpVvY5Z8VOs) - 花一個下午的時間就可以大致了解後端藍圖，賺。

- [tailwind css 文件](https://tailwindcss.com/)

- [react 介紹](https://www.youtube.com/live/zqV7NIFGDrQ?si=jAlaqF1uWq1kQVD7)

- [git 相關指令](https://jagged-veil-0e3.notion.site/git-216c171d3a774b3485baa0932aa46b40?pvs=4)

#### VSCode Extensions (Optional but highly recommended!)

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
