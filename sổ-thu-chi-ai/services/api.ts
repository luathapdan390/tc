import { TransactionPayload, GASResponse } from '../types';

const GAS_URL = "https://script.google.com/macros/s/AKfycbxXCEFDDimAAxeDvh06Z__0mVY4x5BC9LcYIbYX__rXWrWmhsB_uEQazu5i08LUToD6/exec";

export const submitTransaction = async (payload: TransactionPayload): Promise<GASResponse> => {
  try {
    // Using mode: 'no-cors' as requested.
    // This allows the request to be sent to Google Apps Script without CORS errors,
    // but the response will be "opaque" (status 0, unreadable body).
    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        // Content-Type 'application/json' is not allowed in no-cors mode.
        // We use 'text/plain', and GAS should parse the postData.contents.
        "Content-Type": "text/plain", 
      },
      body: JSON.stringify(payload)
    });

    // Since we cannot read the response in no-cors mode, we assume success if no network error occurred.
    return { result: "success" };
  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
};