// import AWS from "aws-sdk";
// import createError from 'http-errors';
import { getEndedAuctions } from '../lib/getEndedaucation.js';

// const dynamodb = new AWS.DynamoDB.DocumentClient();



const processAuctions = async (event, context) => {
    const auctionsToClose = await getEndedAuctions();
    console.log(auctionsToClose);

    return {
        statusCode: 200,
        body: JSON.stringify({})
    };
};

export const handler = processAuctions; 