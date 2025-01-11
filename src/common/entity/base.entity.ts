import { Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    //TODO: change createdBy to be nullable int
    @Column({ type: 'varchar', length: 300 })
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
    //TODO: change lastChangedBy to be nullable int
    @Column({ type: 'varchar', length: 300 })
    lastChangedBy: string;
}