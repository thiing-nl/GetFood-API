import { JsonProperty, Required } from '@tsed/common';
import { Example } from '@tsed/swagger';

export class ListColor {
  @JsonProperty()
  @Required()
  @Example('#1abc9c')
  public color: string;

  constructor(
    color: string
  ) {
    this.color = color;
  }
}

// Valid List Colors
export const LIST_COLORS = [
  new ListColor('#1abc9c'),
  new ListColor('#16a085'),
  new ListColor('#2ecc71'),
  new ListColor('#27ae60'),
  new ListColor('#3498db'),
  new ListColor('#2980b9'),
  new ListColor('#9b59b6'),
  new ListColor('#8e44ad'),
  new ListColor('#f1c40f'),
  new ListColor('#f39c12'),
  new ListColor('#e67e22'),
  new ListColor('#d35400'),
  new ListColor('#e74c3c'),
  new ListColor('#c0392b')
];

export const LIST_COLORS_STRINGS = LIST_COLORS.map((listColor) => listColor.color);
