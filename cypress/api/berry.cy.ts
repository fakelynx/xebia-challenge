import { z } from "zod";
import type { TestData } from "../types";
import { parseData } from "../support/csv";

const NamedResourceSchema = z.object({ name: z.string(), url: z.string() });

const BerrySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  growth_time: z.number().positive(),
  max_harvest: z.number().positive(),
  natural_gift_power: z.number(),
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
  firmness: NamedResourceSchema,
  flavors: z.array(z.object({ potency: z.number(), flavor: NamedResourceSchema })),
  item: NamedResourceSchema,
  natural_gift_type: NamedResourceSchema,
});

const BerryFlavorSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
  berries: z.array(z.object({ potency: z.number(), berry: NamedResourceSchema })).nonempty(),
  contest_type: NamedResourceSchema,
  names: z.array(z.unknown()),
});

type BerryResponse = z.infer<typeof BerrySchema>;
type BerryFlavorResponse = z.infer<typeof BerryFlavorSchema>;

describe("PokéAPI Berry API", () => {
  let data: TestData;

  before(() => {
    parseData("berry-api").then((d) => {
      data = d;
    });
  });

  it("given the berry endpoint, when requesting a berry by valid numeric id, then it returns 200 with a well-formed berry object", () => {
    cy.request<BerryResponse>({
      method: "GET",
      url: `${data.baseUrl}/berry/${data.validBerryId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const berry = BerrySchema.parse(response.body);
      expect(berry.id).to.eq(Number(data.validBerryId));
    });
  });

  it("given the berry endpoint, when requesting a berry by a non-existent numeric id, then it returns 404", () => {
    cy.request({
      method: "GET",
      url: `${data.baseUrl}/berry/${data.invalidBerryId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("given the berry endpoint, when requesting a berry by valid name, then it returns 200 with a well-formed berry object", () => {
    cy.request<BerryResponse>({
      method: "GET",
      url: `${data.baseUrl}/berry/${data.validBerryName}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const berry = BerrySchema.parse(response.body);
      expect(berry.name).to.eq(data.validBerryName);
    });
  });

  it("given the berry endpoint, when requesting a berry by a non-existent name, then it returns 404", () => {
    cy.request({
      method: "GET",
      url: `${data.baseUrl}/berry/${data.invalidBerryName}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("given the berry-flavor endpoint, when requesting a flavor by valid name, then it returns 200 with a well-formed flavor object", () => {
    cy.request<BerryFlavorResponse>({
      method: "GET",
      url: `${data.baseUrl}/berry-flavor/${data.validFlavorName}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const flavor = BerryFlavorSchema.parse(response.body);
      expect(flavor.name).to.eq(data.validFlavorName);
    });
  });

  it("given the berry-flavor/spicy endpoint, when finding the berry with highest potency and fetching it, then the berry response includes the spicy flavor with matching potency", () => {
    cy.request<BerryFlavorResponse>({
      method: "GET",
      url: `${data.baseUrl}/berry-flavor/spicy`,
    }).then((flavorResponse) => {
      expect(flavorResponse.status).to.eq(200);
      const flavor = BerryFlavorSchema.parse(flavorResponse.body);

      const topEntry = flavor.berries.reduce((prev, curr) =>
        curr.potency > prev.potency ? curr : prev,
      );
      const topBerryName = topEntry.berry.name;
      const topPotency = topEntry.potency;

      cy.log(`Highest potency spicy berry: ${topBerryName} (potency: ${topPotency})`);

      cy.request<BerryResponse>({
        method: "GET",
        url: `${data.baseUrl}/berry/${topBerryName}`,
      }).then((berryResponse) => {
        expect(berryResponse.status).to.eq(200);
        const berry = BerrySchema.parse(berryResponse.body);

        const spicyFlavor = berry.flavors.find((f) => f.flavor.name === "spicy");
        expect(spicyFlavor).to.not.be.undefined;
        expect(spicyFlavor!.potency).to.eq(topPotency);
      });
    });
  });
});
