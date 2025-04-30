// import AWS from "aws-sdk";
import createError from 'http-errors';
import { getEndedAuctions } from '../lib/getEndedaucation.js';
import { closeAuction } from '../lib/closeAuction.js';

// const dynamodb = new AWS.DynamoDB.DocumentClient();



const processAuctions = async (event, context) => {
    try{

        const auctionsToClose = await getEndedAuctions();
        const closePromises = auctionsToClose.map(async (auction) => closeAuction(auction));
        await Promise.all(closePromises);
     
        return { closed: closePromises.length,};
    }catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
};

export const handler = processAuctions; 