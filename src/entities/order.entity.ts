import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Customer } from './customer.entity';
import { generateEntityId } from 'src/utils/utility';

@Entity()
export class Order {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @Column()
  region: string;

  @Column({ type: 'date' })
  dateOfSale: Date;

  @Column('int')
  quantitySold: number;

  @Column('float')
  unitPrice: number;

  @Column('float')
  discount: number;

  @Column('float')
  shippingCost: number;

  @Column()
  paymentMethod: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId('ord');
  }
}
