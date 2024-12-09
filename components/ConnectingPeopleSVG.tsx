import { motion } from "framer-motion";

export default function ConnectingPeopleSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      className="max-w-full h-auto"
    >
      <motion.g
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <g
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.circle
            cx="400"
            cy="300"
            r="250"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="400"
            cy="300"
            r="200"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.circle
            cx="400"
            cy="300"
            r="150"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.circle
            cx="400"
            cy="300"
            r="100"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.circle
            cx="400"
            cy="300"
            r="50"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
          />
        </g>
      </motion.g>
      <motion.g
        fill="#4F46E5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <circle cx="250" cy="200" r="20" />
        <circle cx="550" cy="200" r="20" />
        <circle cx="400" cy="450" r="20" />
      </motion.g>
      <motion.g
        stroke="#4F46E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <path d="M250 200 L400 300 L550 200" />
        <path d="M400 300 L400 450" />
      </motion.g>
    </svg>
  );
}
