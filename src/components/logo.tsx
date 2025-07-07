import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Крон Мастер Лого</title>
      <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
      <path d="M12 12L6 6" />
      <path d="M12 12l-3.5 7" />
    </svg>
  );
}
