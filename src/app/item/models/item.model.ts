export class Item {
  public name: string;
  public measurementUnit: MeasurementUnit;
  public quantity: number;
  public price: number;
  public perishable: boolean;
  public expirationDate: Date;
  public manufacturingDate: Date;

  constructor(
    name: string,
    measurementUnit: MeasurementUnit,
    quantity: number,
    price: number,
    perishable: boolean,
    expirationDate: Date,
    manufacturingDate: Date
  ) {
    this.name = name;
    this.measurementUnit = measurementUnit;
    this.quantity = quantity;
    this.price = price;
    this.perishable = perishable;
    this.expirationDate = expirationDate;
    this.manufacturingDate = manufacturingDate;
  }
}

export enum MeasurementUnit {
  Litro,
  Quilograma,
  Unidade,
}
