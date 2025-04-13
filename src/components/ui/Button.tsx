import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  href,
  ...props
}) => {
  // Determine base style based on variant
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50";

  // Add variant-specific styles
  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles =
        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus-visible:ring-blue-500";
      break;
    case "secondary":
      variantStyles =
        "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 focus-visible:ring-gray-500";
      break;
    case "outline":
      variantStyles =
        "border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:ring-gray-500";
      break;
    case "danger":
      variantStyles =
        "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus-visible:ring-red-500";
      break;
  }

  // Add size-specific styles
  let sizeStyles = "";
  switch (size) {
    case "sm":
      sizeStyles = "text-xs px-2.5 py-1.5";
      break;
    case "md":
      sizeStyles = "text-sm px-4 py-2";
      break;
    case "lg":
      sizeStyles = "text-base px-5 py-2.5";
      break;
  }

  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

  // If loading, show loading indicator
  const content = isLoading ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {children}
    </>
  ) : (
    children
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {content}
      </Link>
    );
  }

  // Otherwise, render as button
  return (
    <button
      className={buttonStyles}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {content}
    </button>
  );
};
