export type TripOptionKind = "regions" | "seasons";

type TripOptionFields = {
  name: string;
  description: string | null;
  isActive: boolean;
};

export type Region = TripOptionFields & { id: string; imageUrl: string | null };

export type Season = TripOptionFields & {
  id: string;
  startMonth: number | null;
  endMonth: number | null;
};

export type TripOptionInput = TripOptionFields &
  (
    | { kind: "regions"; image?: File }
    | { kind: "seasons"; startMonth: number | null; endMonth: number | null }
  );
