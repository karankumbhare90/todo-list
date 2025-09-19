import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import backendURL from "../constant";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerErrors({});

    try {
      const response = await fetch(`${backendURL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        // Example backend response: { success: false, errors: { email: "Email already exists" } }
        if (result.errors) {
          setServerErrors(result.errors);
        } else {
          throw new Error(result.message || "Registration failed");
        }
        return;
      }

      // Save token
      localStorage.setItem("token", result.token);

      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      // general error
      setServerErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="container mx-auto h-full">
        <div className="w-full h-full flex items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <h2 className="form-heading">Register</h2>

            <div className="w-full flex flex-col gap-5">

              {/* Name Field */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Name"
                  className="form-input"
                  {...register("name", {
                    required: "Name is required",
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message: "Invalid name",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
                {serverErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{serverErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
                {serverErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{serverErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="w-full">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
                {serverErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{serverErrors.password}</p>
                )}
              </div>

              {/* General Error */}
              {serverErrors.general && (
                <p className="text-red-500 text-sm mt-1">{serverErrors.general}</p>
              )}


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-black button text-white transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="w-full text-base text-center">Already have an account ? <a href="/login" className="text-blue-600 hover:text-blue-700">Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
