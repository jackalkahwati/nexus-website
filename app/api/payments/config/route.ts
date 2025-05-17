import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'lib/auth'
import { stripe } from 'lib/stripe'
import { env } from 'config/env'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Fetch active products and prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    })

    // Format products with prices
    const formattedProducts = products.data.map((product) => {
      const price = product.default_price as any
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        priceId: price?.id,
        unitAmount: price?.unit_amount ? price.unit_amount / 100 : null,
        currency: price?.currency,
        interval: price?.recurring?.interval,
        intervalCount: price?.recurring?.interval_count,
      }
    })

    return NextResponse.json({
      publishableKey: env.stripe.publishableKey,
      products: formattedProducts,
    })
  } catch (error) {
    console.error('Error fetching payment config:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, description, amount, currency = 'usd', interval } = body

    // Create or update product
    const product = await stripe.products.create({
      name,
      description,
      default_price_data: {
        currency,
        unit_amount: Math.round(amount * 100),
        recurring: interval ? { interval } : undefined,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating payment config:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
