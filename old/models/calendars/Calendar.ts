import {Enum, IgnoreProperty, Pattern, Property, Required} from "@tsed/common";
import {Model} from "@tsed/mongoose";

@Model()
export class Calendar {
    @IgnoreProperty()
    _id: string;

    @Property()
    @Required()
    name: string;

    @Property()
    @Pattern(/romain|lili/)
    owner: string;
}