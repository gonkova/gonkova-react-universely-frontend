import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Registration</h1>
      <RegisterForm />
    </div>
  );
}
