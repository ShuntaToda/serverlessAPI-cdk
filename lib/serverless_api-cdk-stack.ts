import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import path = require("path");
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ServerlessApiCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDBテーブルの作成
    const table = new dynamodb.Table(this, "Products", {
      tableName: "Products",
      partitionKey: {
        name: "product_id",
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    // Lambda関数の作成

    const getProduct = new lambda.Function(this, "getProduct", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "getProduct.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const postProduct = new lambda.Function(this, "postProduct", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "postProduct.handler",
      code: lambda.Code.fromAsset("lambda"),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // DynamoDBテーブルへのアクセスポリシーをLambda関数に追加
    table.grantReadData(getProduct);
    table.grantWriteData(postProduct);

    // // API Gatewayの作成
    const api = new apigateway.RestApi(this, "serverlessApi", {
      restApiName: "serverless API",
    });

    // // API Gatewayのリソースと統合を作成
    const getProductIntegration = new apigateway.LambdaIntegration(getProduct);
    api.root.addMethod("GET", getProductIntegration);
    const postProductIntegration = new apigateway.LambdaIntegration(postProduct);
    api.root.addMethod("POST", postProductIntegration);

    api.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    });
  }
}
