"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGatewayStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
class ApiGatewayStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.apiGateway = new aws_apigateway_1.LambdaRestApi(this, `ApiGateway`, {
            handler: props.handler,
        });
    }
}
exports.ApiGatewayStack = ApiGatewayStack;
