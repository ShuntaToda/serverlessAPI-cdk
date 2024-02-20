import os
import boto3

def handler(event, context):
    # DynamoDBテーブル名を環境変数から取得
    table_name = "Products"
    
    # DynamoDBクライアントの初期化
    dynamodb = boto3.resource('dynamodb')
    
    # DynamoDBテーブルの取得
    table = dynamodb.Table(table_name)
    
    # クエリパラメータからidを取得
    queryStringParameters = event.get('queryStringParameters')
    
    
    if queryStringParameters is None:
        response_data = {
          'statusCode': 200,
          'body': 'no query'
        }
        return response_data
      
    id = queryStringParameters.get('product_id')
    if id is None:
        response_data = {
          'statusCode': 200,
          'body': 'no query'
        }
        return response_data

    # テーブルから指定されたidのデータを取得
    # return queryStringParameters
    response_data = table.put_item(Item=queryStringParameters)
    return response_data