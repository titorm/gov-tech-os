import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({
  timestamps: true,
  collection: 'logs',
})
export class Log {
  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;

  @Prop()
  userId?: string;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  endpoint?: string;

  @Prop()
  method?: string;

  @Prop()
  statusCode?: number;

  @Prop()
  responseTime?: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);

// Index for better query performance
LogSchema.index({ timestamp: -1, level: 1 });
LogSchema.index({ userId: 1, timestamp: -1 });