import { Box } from '@mui/material'
import { ReactNode } from 'react'

const ZapIcon = ({ color }: { color: string }) => {
  let stroke = '#0F7EFE'
  if (color === 'white') stroke = 'white'
  return (
    <svg width='14' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M7.66667 1L1 10.6H7L6.33333 17L13 7.4H7L7.66667 1Z'
        fill={color}
        stroke={stroke}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const TickIcon = () => {
  return (
    <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='26' height='26' rx='6' fill='white' />
      <path
        d='M7.75 13L11.5 16.75L19 9.25'
        stroke='#28C76F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const RightSideArrow = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'>
      <g transform='rotate(90 12 12)'>
        <path
          fill='currentColor'
          d='M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19zm9-12.243L19.092 17H4.908L12 6.757z'
        />
      </g>
    </svg>
  )
}

const CustomIcon = ({ border, bgColor, icon }: { border?: string; bgColor: string; icon: ReactNode }) => {
  return (
    <Box display='flex' padding={1} alignItems='center' borderRadius='100%' bgcolor={bgColor} border={border}>
      {icon}
    </Box>
  )
}

const ChartIcon = () => {
  return (
    <svg width='27' height='35' viewBox='0 0 27 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g opacity='0.8'>
        <path
          d='M24.5 31.7234V13.9796'
          stroke='rgba(98, 214, 197, 1)'
          strokeWidth='5'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>
        <path
          d='M13.75 31.7234V3.33337'
          stroke='rgba(98, 214, 197, 1)'
          strokeWidth='5'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>
        <path
          d='M3 31.7231V21.0768'
          stroke='rgba(98, 214, 197, 1)'
          strokeWidth='5'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>
      </g>
    </svg>
  )
}

const BoltIcon = () => {
  return (
    <svg width='35' height='35' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M22.6654 11.3333V7.08331L26.9154 2.83331L28.332 5.66665L31.1654 7.08331L26.9154 11.3333H22.6654ZM22.6654 11.3333L16.9987 16.9998M31.1654 17C31.1654 24.8239 24.8227 31.1666 16.9987 31.1666C9.17466 31.1666 2.83203 24.8239 2.83203 17C2.83203 9.17594 9.17466 2.83331 16.9987 2.83331M24.082 17C24.082 20.912 20.9107 24.0833 16.9987 24.0833C13.0867 24.0833 9.91536 20.912 9.91536 17C9.91536 13.088 13.0867 9.91665 16.9987 9.91665'
        stroke='#fd9351'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
    </svg>
  )
}

export { ZapIcon, TickIcon, RightSideArrow, CustomIcon, ChartIcon, BoltIcon }
