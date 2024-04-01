import FormInput from "@/components/form-input";
import FormButton from "@/components/forn-btn";
import SocialLogin from "@/components/social-login";

export default function Login() {
  const handleForm = async (formData: FormData) => {
    "use server";
    console.log(formData.get("email"), formData.get("password"));
    console.log("i run in the server!");
    // 지연시간 추가
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form
        action={handleForm}
        className="flex flex-col gap-3"
      >
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormButton text="Create account" />
      </form>

      <SocialLogin />
    </div>
  );
}
