import type { SVGProps } from "react"

export function BullIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 612 612" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M306 0C137 0 0 137 0 306s137 306 306 306 306-137 306-306S475 0 306 0zm0 535.5c-126.8 0-229.5-102.7-229.5-229.5S179.2 76.5 306 76.5 535.5 179.2 535.5 306 432.8 535.5 306 535.5z"
        fill="currentColor"
      />
      <path
        d="M306 153c-84.4 0-153 68.6-153 153s68.6 153 153 153 153-68.6 153-153-68.6-153-153-153zm0 229.5c-42.2 0-76.5-34.3-76.5-76.5s34.3-76.5 76.5-76.5 76.5 34.3 76.5 76.5-34.3 76.5-76.5 76.5z"
        fill="currentColor"
      />
    </svg>
  )
}
