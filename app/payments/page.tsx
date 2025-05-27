"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
}

function Step({ number, title, children }: StepProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function PaymentSetupPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-8">
        <h1 className="text-4xl font-bold mb-6">Setting Up Payments for Vehicle Rentals</h1>
        <Separator className="my-6" />

        <div className="space-y-6">
          <Step number={1} title="Introduction to Payments">
            <p className="text-lg text-muted-foreground">
              Payments are essential for generating revenue from your vehicle rentals. This setup allows you to enable payment integration and start monetizing your fleet.
            </p>
          </Step>

          <Step number={2} title="Accessing the Payments Section">
            <p className="text-lg text-muted-foreground">
              Navigate to the Payments section by selecting the "Payments" button on the left menu pane.
            </p>
          </Step>

          <Step number={3} title="Understanding Fleet with and without Payments">
            <ul className="list-disc ml-8 text-lg text-muted-foreground space-y-2">
              <li>You can have a fleet without payments or a fleet with payments.</li>
              <li>If your fleet doesn't include payments, you won't see the "Payments" button on the left menu.</li>
              <li>For fleets with payment integration, the Payments section becomes available in the menu.</li>
              <li>To switch from a non-payment fleet to one with payments, contact the Lattis team for backend updates.</li>
            </ul>
          </Step>

          <Step number={4} title="Connecting to Stripe for Payments">
            <ul className="list-disc ml-8 text-lg text-muted-foreground space-y-2">
              <li>
                Once payments are integrated with your fleet, your fleet will remain unrentable until you link your Stripe account.
              </li>
              <li>Begin by inputting your Stripe integration code.</li>
              <li>A Stripe login prompt will appear; log in using your Stripe credentials.</li>
              <li>
                After a successful setup, a checkmark will be displayed, allowing you to proceed with setting up pricing and revenue generation.
              </li>
            </ul>
          </Step>

          <Step number={5} title="Configuring Payment Options">
            <ul className="list-disc ml-8 text-lg text-muted-foreground space-y-2">
              <li>The primary configuration is pay-per-use, where you set the base fare.</li>
              <li>The base fare can be defined on an hourly, minutely, daily, or weekly basis.</li>
              <li>
                Optionally, implement surcharge fees that apply after a specified time, resulting in additional charges.
              </li>
              <li>
                You can also set penalty fees, such as parking penalties for out-of-zone parking or an unlock fee for per-minute pricing.
              </li>
            </ul>
          </Step>

          <Step number={6} title="Setting Up Memberships">
            <ul className="list-disc ml-8 text-lg text-muted-foreground space-y-2">
              <li>Create membership plans for frequent renters, which can be weekly, monthly, or yearly.</li>
              <li>Determine the discount amount and set a price for the membership.</li>
              <li>Users pay upfront for memberships, receiving the designated discount upon renewal.</li>
            </ul>
          </Step>

          <Step number={7} title="Promo Codes for Discounts">
            <ul className="list-disc ml-8 text-lg text-muted-foreground space-y-2">
              <li>Promo codes provide one-time use discounts to riders.</li>
              <li>Decide on the discount percentage or amount.</li>
              <li>Determine whether a promo code is redeemable by one or multiple users.</li>
              <li>Generate and distribute the promo code to potential riders.</li>
              <li>Riders enter the code in the app's payment section to apply the discount to their next ride.</li>
              <li>If necessary, you can deactivate a promo code to prevent further use, then generate new codes as needed.</li>
            </ul>
          </Step>
        </div>
      </Card>
    </div>
  );
} 