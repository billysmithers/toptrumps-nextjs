export class Capability
{
  capability: string
  value: number

  constructor(capability: string, value: number)
  {
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
  value: number
}
