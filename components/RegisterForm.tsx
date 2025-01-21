"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

// Define validation schema using Zod
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^[A-Z]/, "Password must start with a capital letter")
      .regex(/\d/, "Password must include at least one number"),
    confirmPassword: z.string(),
    bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
    location: z.string().max(100, "Location must be at most 100 characters").optional(),
    website: z.string().optional().nullable(),
    instagramProfile: z.string().optional().nullable(),
    githubProfile: z.string().optional().nullable(),
    linkedinProfile: z.string().optional().nullable(),
    skills: z.string().max(500, "Skills must be at most 500 characters").optional(),
    currentlyWorkingAt: z.string().max(100, "Current work must be at most 100 characters").optional(),
    pastWorkedAt: z.string().max(200, "Past work must be at most 200 characters").optional(),
    session: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [sessionOptions, setSessionOptions] = useState<string[]>([])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const options = []
    for (let year = 2010; year <= currentYear; year++) {
      options.push(`${year}-${year + 1}`)
    }
    setSessionOptions(options.reverse())
  }, [])

  // React Hook Form integration with Zod
  const {
    register,
    handleSubmit,
    reset, // Use reset to clear the form
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          session: data.session || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      toast.success("Registration successful!")
      reset() // Clear the form fields
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Username Field */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          id="username"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="johndoe"
        />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </motion.div>

      {/* Password Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </motion.div>

      {/* Confirm Password Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword")}
          type="password"
          id="confirmPassword"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="••••••••"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </motion.div>

      {/* Bio Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          {...register("bio")}
          id="bio"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="A brief description about yourself"
        ></textarea>
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
      </motion.div>

      {/* Location Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          {...register("location")}
          type="text"
          id="location"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="City, Country"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
      </motion.div>

      {/* Website Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website (Optional)
        </label>
        <input
          {...register("website", { required: false })} // Website is optional
          type="url"
          id="website"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="https://example.com (Optional)"
        />
        {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
      </motion.div>

      {/* Instagram Profile Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <label htmlFor="instagramProfile" className="block text-sm font-medium text-gray-700">
          Instagram Profile (Optional)
        </label>
        <input
          {...register("instagramProfile")}
          type="url"
          id="instagramProfile"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="https://www.instagram.com/username"
        />
        {errors.instagramProfile && <p className="mt-1 text-sm text-red-600">{errors.instagramProfile.message}</p>}
      </motion.div>

      {/* GitHub Profile Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700">
          GitHub Profile (Optional)
        </label>
        <input
          {...register("githubProfile")}
          type="url"
          id="githubProfile"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="https://github.com/username"
        />
        {errors.githubProfile && <p className="mt-1 text-sm text-red-600">{errors.githubProfile.message}</p>}
      </motion.div>

      {/* LinkedIn Profile Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-700">
          LinkedIn Profile (Optional)
        </label>
        <input
          {...register("linkedinProfile")}
          type="url"
          id="linkedinProfile"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="https://www.linkedin.com/in/username"
        />
        {errors.linkedinProfile && <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile.message}</p>}
      </motion.div>

      {/* Skills Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills (Optional)
        </label>
        <textarea
          {...register("skills")}
          id="skills"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="List your skills, separated by commas"
        ></textarea>
        {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
      </motion.div>

      {/* Currently Working At Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <label htmlFor="currentlyWorkingAt" className="block text-sm font-medium text-gray-700">
          Currently Working At (Optional)
        </label>
        <input
          {...register("currentlyWorkingAt")}
          type="text"
          id="currentlyWorkingAt"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Current Company or Position"
        />
        {errors.currentlyWorkingAt && <p className="mt-1 text-sm text-red-600">{errors.currentlyWorkingAt.message}</p>}
      </motion.div>

      {/* Past Worked At Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <label htmlFor="pastWorkedAt" className="block text-sm font-medium text-gray-700">
          Past Work Experience (Optional)
        </label>
        <textarea
          {...register("pastWorkedAt")}
          id="pastWorkedAt"
          className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="List your past work experiences"
        ></textarea>
        {errors.pastWorkedAt && <p className="mt-1 text-sm text-red-600">{errors.pastWorkedAt.message}</p>}
      </motion.div>

      {/* Session Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <label htmlFor="session" className="block text-sm font-medium text-gray-700">
          Session (Optional)
        </label>
        <select
          {...register("session")}
          id="session"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a session</option>
          {sessionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.session && <p className="mt-1 text-sm text-red-600">{errors.session.message}</p>}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        {isLoading ? "Registering..." : "Register"}
      </motion.button>
    </form>
  )
}

