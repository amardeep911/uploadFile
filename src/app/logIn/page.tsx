"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xs py-20 mx-auto"
      >
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            {...register("username", { required: true })}
            aria-invalid={errors.username ? "true" : "false"}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          {errors.username?.type === "required" && (
            <p role="alert" className="text-red-600">
              First name is required
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
            aria-invalid={errors.password ? "true" : "false"}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          {errors.password?.type === "required" && (
            <p role="alert" className="text-red-600">
              Password is required
            </p>
          )}
        </div>
        <input type="submit" className="hover:bg-blue-400 p-3 rounded-full" />
      </form>

      <p>Or log in with</p>

      <button className="hover:bg-blue-400 p-3 rounded-full">Google</button>
    </div>
  );
};

export default LoginForm;
