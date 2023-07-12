import { useState } from "react";
import InputMask from "react-input-mask";
import { Loader2 } from "lucide-react";

function getDeviceLink() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/android/.test(userAgent)) {
    return "https://play.google.com/store/apps/details?id=finance.empower";
  } else if (/iphone|ipod|ipad/.test(userAgent)) {
    return "https://apps.apple.com/us/app/empower-cash-advance-%24250/id1136397354";
  } else {
    return "Unable to find device link";
  }
}

function convertToPhoneNumberFormat(number: string) {
  var formattedNumber =
    "(" +
    number.substring(0, 3) +
    ") " +
    number.substring(3, 6) +
    "-" +
    number.substring(6);
  return formattedNumber;
}

function PhoneNumberForm({
  onSuccessfulSubmission,
}: {
  onSuccessfulSubmission: (phoneNumber: string) => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const phoneNumberNumericString = phoneNumber.replace(/\D/g, ""); // Removes non-numeric characters from the string. Example (123) 456-7890 -> 1234567890
    setIsSubmitting(true);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: phoneNumberNumericString }),
    });
    setIsSubmitting(false);

    if (response.ok) {
      onSuccessfulSubmission(phoneNumberNumericString);
      return;
    }

    const data = await response.json();
    const error = data.error;
    setError(error);
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="phoneNumber" className="font-semibold text-base">
        Enter your phone number:
      </label>
      <div className="h-4" />
      <InputMask
        id="phoneNumber"
        name="phoneNumber"
        className="pl-6 w-full h-12 sm:w-[300px] mb-4 rounded-full border-2 border-camel text-[15px] font-light"
        aria-label="Mobile number"
        mask="(999) 999-9999"
        type="tel"
        pattern="\(\d{3}\) \d{3}-\d{4}"
        placeholder="(000) 000-0000"
        required
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhoneNumber(e.target.value)
        }
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white w-full h-12 sm:w-[148px] sm:mx-4 rounded-full text-[15px] font-semibold disabled:pointer-events-none disabled:opacity-50 inline-flex justify-center items-center"
      >
        Sign up
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </button>
      {error && (
        <div className="text-base font-medium text-destructive">{error}</div>
      )}
    </form>
  );
}

function TwoFactorAuthForm({
  onSuccessfulSubmission,
  values,
}: {
  onSuccessfulSubmission: () => void;
  values: { phoneNumber?: string };
}) {
  const [authCode, setAuthCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deviceLink, setDeviceLink] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: values.phoneNumber, code: authCode }),
    });
    setIsSubmitting(false);

    if (response.ok) {
      onSuccessfulSubmission();
      setDeviceLink(getDeviceLink());
      return;
    }

    const data = await response.json();
    const error = data.error;
    setError(error);
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="authCode" className="font-semibold text-base">
        Enter 6-digit code
      </label>
      <div className="h-4" />
      <InputMask
        id="authCode"
        name="authCode"
        className="pl-6 w-full h-12 sm:w-[300px] mb-4 rounded-full border-2 border-camel text-[15px] font-light"
        mask="aaaaaa"
        type="text"
        pattern="[A-Z]{6}"
        placeholder="AAAAAA"
        required
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAuthCode(e.target.value.toUpperCase())
        }
        value={authCode}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white w-full h-12 sm:w-[148px] sm:mx-4 rounded-full text-[15px] font-semibold disabled:pointer-events-none disabled:opacity-50 inline-flex justify-center items-center"
      >
        Verify
        {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </button>
      {error && (
        <div className="text-base font-medium text-destructive">{error}</div>
      )}
      {deviceLink && <div className="text-base font-medium">{deviceLink}</div>}
    </form>
  );
}

function PhoneNumberVerification({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="px-6">
        <h1 className="text-[40px] font-bold font-serif leading-dense tracking-[-.01em]">
          Get Cash Advance up to $250 in less than{" "}
          <span className="whitespace-nowrap">5 minutes</span>
        </h1>
        <div aria-hidden className="h-4" />
      </div>

      <div className="px-6">
        <h2 className="text-lg leading-[26px] text-gray">
          No interest. No late fees. No credit checks. Eligibility applies.
        </h2>
      </div>
      {children}
    </>
  );
}

function TwoFactorAuthVerification({
  phoneNumber,
  children,
}: {
  phoneNumber: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="px-6">
        <h1 className="text-[40px] font-bold font-serif leading-dense tracking-[-.01em]">
          Verify your number
        </h1>
        <div aria-hidden className="h-4" />
      </div>

      <div className="px-6">
        <h2 className="text-lg leading-[26px] text-gray">
          We sent the SMS code to {convertToPhoneNumberFormat(phoneNumber)}
        </h2>
      </div>
      {children}
    </>
  );
}

export default function Home() {
  const [form, setForm] = useState("phone-number");
  // save values needed for other forms
  const [values, setValues] = useState({});

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="bg-pastel-peach w-full lg:max-w-[542px]">
          {form === "phone-number" && (
            <img
              src="https://app.empower.me/_next/static/media/bg1.b99a82af.png"
              className="w-full"
              alt="Empower background photo"
            />
          )}
          {form === "two-factor-auth" && (
            <img
              src="https://app.empower.me/_next/static/media/bg2.2b94b465.png"
              className="w-full"
              alt="Empower background photo"
            />
          )}
        </div>

        <div className="container">
          <div className="px-6 py-8">
            <img
              alt="Empower logo"
              src="https://app.empower.me/_next/static/media/empower-logo.87a83332.svg"
            />
          </div>

          {form === "phone-number" && (
            <PhoneNumberVerification>
              <div className="px-6 py-8">
                <PhoneNumberForm
                  onSuccessfulSubmission={(phoneNumber) => {
                    setValues((prevValues) => ({ ...prevValues, phoneNumber }));
                    setForm("two-factor-auth");
                  }}
                />
              </div>
            </PhoneNumberVerification>
          )}

          {form === "two-factor-auth" && (
            // @ts-ignore
            <TwoFactorAuthVerification phoneNumber={values.phoneNumber}>
              <div className="px-6 py-8">
                <TwoFactorAuthForm
                  onSuccessfulSubmission={() => {}}
                  values={values}
                />
              </div>
            </TwoFactorAuthVerification>
          )}
          {/* Legal */}
          <div className="py-6 px-6">
            <div className="text-xs text-gray">
              By signing up, you agree to our Privacy Policy, Terms and E-Sign.
              Message and data rates may apply.
            </div>
            <div className="h-6" />
            <div className="text-xs text-gray">
              Empower is a financial technology company, not a bank. Banking
              services provided by nbkc bank, Member FDIC. Empower Thrive
              provided by FinWise Bank, Member FDIC. Empower charges an
              auto-recurring monthly subscription fee of $8 (a) after the 14-day
              free trial concludes for first-time customers, and (b) immediately
              for customers returning for a second or subsequent subscription.
              Instant delivery fees may apply.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
