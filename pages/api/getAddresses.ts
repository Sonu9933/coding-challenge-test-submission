import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

const validateNumericField = (
  value: string,
  fieldName: string,
  minLength = 0
): string | undefined => {
  if (!/^\d+$/.test(value)) {
    return `${fieldName} must be all digits and non negative!`;
  }
  if (minLength > 0 && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} digits!`;
  }
  return undefined;
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  const postcodeError = validateNumericField(postcode as string, "Postcode", 4);
  if (postcodeError) {
    return res.status(400).send({
      status: "error",
      errormessage: postcodeError,
    });
  }

  const streetError = validateNumericField(
    streetnumber as string,
    "Street Number"
  );
  if (streetError) {
    return res.status(400).send({
      status: "error",
      errormessage: streetError,
    });
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    errormessage: "No results found!",
  });
}
