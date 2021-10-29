export class Capability
{
  capability: string
  value: string

  constructor(capability: string, value: string)
  {
    if (isNaN(parseFloat(value))) {
      throw 'A capability value must be numeric.';
    }

    this.capability = capability;
    this.value = value;
  }

  public toObject(): CapabilityJson
  {
    return {
      capability: this.capability,
      value: this.value
    }
  }
}

export type CapabilityJson = {
  capability: string
  value: string
}
