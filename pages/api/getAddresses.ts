import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

const isStrictlyNumeric = (value: string): boolean => {
  return /^\d+$/.test(value) && !value.startsWith('-');
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

  if ((postcode as string).length < 4) {
    return res.status(400).send({
      status: "error",
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  if (!isStrictlyNumeric(postcode as string)) {
    return res.status(400).send({
      status: "error",
      errormessage: "Postcode must be all digits and non negative!",
    });
  }

  if (!isStrictlyNumeric(streetnumber as string)) {
    return res.status(400).send({
      status: "error",
      errormessage: "Street Number must be all digits and non negative!",
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
