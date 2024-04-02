"use server";

export const handleForm = async (prevState: any, formData: FormData) => {
  console.log(formData.get("email"), formData.get("password"));
  console.log("i run in the server!");
  // 지연시간 추가
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    error: ["wrong password", "password too short"],
  };
};
