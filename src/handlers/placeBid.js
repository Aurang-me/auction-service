import AWS from "aws-sdk";
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware.js';
import { getAuctionById } from './getAuction.js';


const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event, context) => {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const auction = await getAuctionById(id);

    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updatedAuction;

    try {

        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;

    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction)
    };
};

export const handler = commonMiddleware(placeBid);