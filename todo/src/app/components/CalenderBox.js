"use client"

import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export default function CalendarBox({ onDateChange }) {

  const [date,setDate] = useState(new Date())

  function handleDateChange(value){

    setDate(value)

    if(onDateChange){
      onDateChange(value)
    }

  }

  return (

    <div className="bg-white text-black rounded p-2">

      <Calendar value={date}  onChange={handleDateChange}/>

    </div>

  )
}
