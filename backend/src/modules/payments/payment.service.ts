import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService implements OnModuleInit {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;
  private webhookSecret: string | undefined;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!stripeSecretKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured - payment service operating in simulation mode');
      return;
    }

    this.stripe = new Stripe(stripeSecretKey, { maxNetworkRetries: 2 });

    this.logger.log('Stripe payment service initialized');
  }

  /**
   * Create a payment session
   * INT-04: Configurer webhooks Stripe (partiel)
   */
  async createPaymentSession({
    amount,
    currency = 'usd',
    customerEmail,
    successUrl,
    cancelUrl,
    metadata,
  }: {
    amount: number;
    currency?: string;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string; url: string | null; status: string | null }> {
    if (!this.stripe) {
      // Return simulated response when Stripe not configured
      return {
        id: 'sim_001',
        url: 'https://certiuni-simulator.com/payment/success',
        status: 'pending',
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: 'CertiUni Service',
          },
          unit_amount: amount * 100, // Stripe expects cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });

    return {
      id: session.id,
      url: session.url,
      status: session.status,
    };
  }

  /**
   * Retrieve a payment session
   */
  async retrievePaymentSession(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session> | { id: string; status: string; amount: number }> {
    if (!this.stripe) {
      return { id: sessionId, status: 'simulated', amount: 0 };
    }

    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  /**
   * Handle webhook event from Stripe
   * INT-04: Configurer webhooks Stripe (partiel)
   */
  async handleWebhookEvent(payload: Buffer, signature: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe n’est pas configuré');
    }

    if (!this.webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET n’est pas configuré');
    }

    const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    this.logger.log(`Received Stripe webhook event: ${event.type}`);

    return { type: event.type, processed: true };
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    reason?: string,
  ): Promise<Stripe.Response<Stripe.Refund> | { id: string; status: string }> {
    if (!this.stripe) {
      return { id: 'ref_sim_001', status: 'simulated' };
    }

    const allowedReasons = ['duplicate', 'fraudulent', 'requested_by_customer'] as const;
    const refundReason = allowedReasons.find((allowed) => allowed === reason);
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(refundReason ? { reason: refundReason } : {}),
    });
  }

  /**
   * Get payment intent
   */
  async retrievePaymentIntent(
    intentId: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent> | { id: string; status: string }> {
    if (!this.stripe) {
      return { id: intentId, status: 'simulated' };
    }

    return this.stripe.paymentIntents.retrieve(intentId);
  }
}