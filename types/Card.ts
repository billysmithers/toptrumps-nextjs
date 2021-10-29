import {Capability,CapabilityJson} from "./Capability";

export class Card
{
  name: string
  capabilities: Array<Capability>
  imageUrl: string | null

  constructor(name: string, capabilitiesData: Array<{ key: string, value: string }>, imageUrl?: string | null) {
    this.name = name
    this.imageUrl = imageUrl
    this.capabilities = [];

    capabilitiesData.map((capability) => {
      this.capabilities.push(new Capability(capability.key, capability.value));
    })

    this.capabilities.sort(Card.compareCapabilities);
  }

  public toObject(): CardJson
  {
    const capabilities = this.capabilities.map((capability: Capability) => {
        return capability.toObject();
    })

    return {
      name: this.name,
      capabilities
    }
  }

  private static compareCapabilities(capabilityA: Capability, capabilityB: Capability)
  {
    const a = capabilityA.capability.toLowerCase();
    const b = capabilityB.capability.toLowerCase();

    if (a === b) {
      return 0;
    }

    return (a < b) ? -1 : 1;
  }
}

export type CardJson = {
  name: string
  capabilities: Array<CapabilityJson>
}
