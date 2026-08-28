import React from 'react'
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
const GoBack = () => {
    const router = useRouter()
  return (
     <button
            className="group text-gray-500 flex w-fit   gap-2 rounded-full button-kiosk font-medium   transition "
            onClick={() => router.push("/")}
          >
            <span className="   flex transition group-hover:-translate-x-0.5">
              <ArrowLeftOutlined />
            </span>
            <span className="capitalize">Go back</span>
          </button>
  )
}

export default GoBack