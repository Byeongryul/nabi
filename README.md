# BackEnd
리얼타임 리드미 에디터api 서버를 목적으로 서버 구축할 예정
## Start
***
passport를 위주로 캡쳐할 예정
1. npm init
  - 이름
  - 0.0.1
  - 간단 설명
  - app.js
  - 
2. lint 연결
  - npm install eslint --save-dev
  - npx install-peerdeps --dev eslint-config-airbnb
  - npx eslint --init
    - problems, commonjs, none, no, node, json
  - eslintrc rule 추가
      ```json
      "no-console": "off",
      "no-unused-vars":"warn"
      ```
3. 디비 다이어그램 만들기
  - https://dbdiagram.io/home
  - User, Post, Hashtag, Follow, PostHashtag
4. 디비 연결(sequelize-auto 사용할 예정)
  - npm i sequelize-auto sequelize-cli
  - npm i sequelize pg pg-hstore
  - npx sequelize-auto -o "./models" -d sequelize_auto_test -h localhost -u my_username -p 5432 -x my_password -e postgres
5. 타 패키지 설치
  - npm i express cookie-parser express-session morgan multer dotenv nunjucks
  - npm i -D nodemon
  - mkdir views routes public passport
  - touch app.js .env
6. 로그인 구현
  - npm i passport passport-local passport-kakao bcrypt

## 문제점
1. sequlize-auto에서 제공하는 것을 이용해서 User 모델을 뽑아내는 것이 어려웠음
2. not null로 인해 이메일, 비밀번호, snsId를 강제로 넣어야 했음...

스웨거 사용
https://any-ting.tistory.com/105