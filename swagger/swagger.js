const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "0.0.1",
      title: "나비 API",
      description:
        "RestFull API 클라이언트 UI",
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
}
const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs }
