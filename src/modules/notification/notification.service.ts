import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TiktokOrderDetail } from 'src/shared/types/order';

@Injectable()
export class NotificationService {
  private readonly botToken = process.env.BOT_TOKEN;
  private readonly chatId = process.env.CHAT_ID;
  constructor(private readonly httpService: HttpService) {}
  sendOrderNotification(orderDetail: TiktokOrderDetail) {
    // Always get image from first item
    const firstItem = orderDetail.line_items[0];
    const imageUrl = firstItem?.sku_image;

    if (imageUrl) {
      return this.sendPhotoWithCaption(orderDetail, imageUrl);
    } else {
      return this.sendTextMessage(orderDetail);
    }
  }

  private sendPhotoWithCaption(
    orderDetail: TiktokOrderDetail,
    imageUrl: string,
  ) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendPhoto`;
    const caption = this.formatOrderMessage(orderDetail);

    return firstValueFrom(
      this.httpService.post(url, {
        chat_id: this.chatId,
        photo: imageUrl,
        caption: caption,
        parse_mode: 'HTML',
      }),
    );
  }

  private sendTextMessage(orderDetail: TiktokOrderDetail) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const orderInfo = this.formatOrderMessage(orderDetail);

    return firstValueFrom(
      this.httpService.post(url, {
        chat_id: this.chatId,
        text: orderInfo,
        parse_mode: 'HTML',
      }),
    );
  }

  private formatOrderMessage(orderDetail: TiktokOrderDetail): string {
    const createDate = new Date(orderDetail.create_time * 1000).toLocaleString(
      'vi-VN',
    );
    const totalAmount = orderDetail.payment.total_amount;
    const currency = orderDetail.payment.currency;

    // Format line items
    const items = orderDetail.line_items
      .map(
        (item) =>
          `• ${item.product_name} (${item.sku_name}) - ${item.sale_price} ${item.currency}`,
      )
      .join('\n');

    return `
🛒 <b>NEW ORDER</b>

📋 <b>Order Information:</b>
• Order ID: <code>${orderDetail.id}</code>
• Status: <b>${orderDetail.status}</b>
• Created At: ${createDate}
• Total Amount: <b>${totalAmount} ${currency}</b>

🛍️ <b>Products:</b>
${items}

📝 <b>Notes:</b> ${orderDetail.buyer_message || 'No notes'}
    `.trim();
  }
}
