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
    
    
    if queryStringParameters is not None:
        id = queryStringParameters.get('product_id')
        if id is not None:
            # テーブルから指定されたidのデータを取得
            response = table.get_item(Key={'product_id': int(id)})
            item = response['Item']
            response_data = {
                'statusCode': 200,
                'body': f'{item}'
            }
            return response_data

    response = table.scan()
    items = response['Items']
    response_data = {
        'statusCode': 200,
        'body': f'{items}'
    }
    
    return response_data