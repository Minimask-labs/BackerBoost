"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard, Bitcoin } from "lucide-react"





export default function CampaignContribution({ campaign }: { campaign: any }) {
  const [amount, setAmount] = useState("")
  const [name, setName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleSubmit = () => {
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribute</CardTitle>
        <CardDescription>Support this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="number"
              min="1"
              placeholder="Contribution amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Your name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PaymentButton
              active={paymentMethod === "crypto"}
              onClick={() => setPaymentMethod("crypto")} 
              icon={<Bitcoin className="h-4 w-4" />}
              label="Crypto"
            />
          </div>
          <Button type="submit" className="w-full">Contribute Now</Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Funds will be locked until the campaign deadline.
      </CardFooter>
    </Card>
  )
}

function PaymentButton({ active, onClick, icon, label }: {active:  boolean, onClick: ()=> void , icon: React.ReactNode, label: string}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      className="flex items-center justify-center gap-2"
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  )
}