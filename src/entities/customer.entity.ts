import { generateEntityId } from 'src/utils/utility';
import { Entity, Column, BeforeInsert, PrimaryColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column()
  customerId: string; // External Customer ID

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerAddress: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId('cus');
  }
}
