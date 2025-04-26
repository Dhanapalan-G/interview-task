import { generateEntityId } from 'src/utils/utility';
import { Entity, Column, BeforeInsert, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column()
  productId: string; // External Product ID

  @Column()
  productName: string;

  @Column()
  category: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId('pdt');
  }
}
