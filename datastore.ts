import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://evolved-shrimp-42383.upstash.io",
  token:
    "AaWPASQgMjExNTc2ZTYtZDMzMi00M2IxLTlkZjQtYTE5YWIzYTRkZmViNTBiOTE0Yjc0NGJlNDg5ODhkZmNhOGFjNDJkMGY3N2U=",
});

const AUTH_CODE_LENGTH = 6;

// generates a random 2FA code
function generate2FA() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (var i = 0; i < AUTH_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

export async function registerPhoneNumber(phoneNumber: string) {
  const phoneNumberExists = await redis.exists(phoneNumber);
  if (phoneNumberExists) {
    throw new Error("Phone number already registered");
  }

  const phoneNumberValidated = await redis.sismember(
    "validatedPhoneNumbers",
    phoneNumber
  );

  if (phoneNumberValidated) {
    throw new Error("Phone number already validated");
  }

  // generate a random 2FA code, for now AAAAAA authenticates
  await redis.set(phoneNumber, "AAAAAA");
}

export async function authenticatePhoneNumber(
  phoneNumber: string,
  code: string
) {
  const expectedCode = await redis.get(phoneNumber);
  if (!expectedCode) {
    throw new Error("Phone number not registered");
  }

  if (code !== expectedCode) {
    throw new Error("Invalid code");
  }

  await redis.del(phoneNumber);

  // Create an account with the phone number, for now we'll add the phone number to the set
  await redis.sadd("validatedPhoneNumbers", phoneNumber);
}
