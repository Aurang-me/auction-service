import AWS from "aws-sdk";
import createError from 'http-errors';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

import commonMiddleware from '../lib/commonMiddleware.js';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema.js'


const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event, context) => {
    let auctions;

    const { status } = event.queryStringParameters;
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status,
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    }

    try {

        if (status) {
            const result = await dynamodb.query(params).promise();
            auctions = result.Items;
        } else {
            const result = await dynamodb.scan({
                TableName: process.env.AUCTIONS_TABLE_NAME,
            }).promise();
            auctions = result.Items;
        }

    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions)
    };
};

export const handler = commonMiddleware(getAuctions)
    .use(
        validator({
            eventSchema: transpileSchema(getAuctionsSchema),
            ajvOptions: {
                strict: false,
                useDefaults: true
            }
        })
    );