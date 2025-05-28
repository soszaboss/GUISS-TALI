"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Smartphone } from "lucide-react"

export function TwoFactorVerification() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move to next input if current one is filled
    if (value !== "" && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join("")
    console.log("Submitted code:", verificationCode)
    // Handle verification logic here
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-6 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-center">Two-Factor Verification</CardTitle>
            <CardDescription className="text-center mt-2">Enter the verification code we sent to</CardDescription>
            <p className="text-center text-lg mt-2">*****7859</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-4">Type your 6 digit security code</p>
                <div className="flex gap-2 justify-between">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="h-14 w-14 text-center text-xl"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
