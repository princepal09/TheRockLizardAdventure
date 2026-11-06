# Road and bike trips

Trips are separate from treks and expeditions. `Trip.tripType` is required and is
either `ROAD` or `BIKE`. All three share the existing publishing, pricing, region,
season, departure/booking-terms, itinerary and image conventions. Optional
`vehicleDetails` (up to 5,000 characters) describes transport, bike/rental options,
support vehicles, licence requirements and fuel arrangements confirmed by the operator.

Base URL: `/api/v1/trips`. Responses use the existing `{ success, message, data }`
envelope. Prices and distances serialize as decimals. New records default to DRAFT.

| Method         | Path                                | Access / behavior                                |
| -------------- | ----------------------------------- | ------------------------------------------------ |
| GET            | `/`                                 | Public; published records only                   |
| GET            | `/slug/:slug`                       | Public; unpublished/missing records return 404   |
| GET            | `/admin`                            | Admin; all statuses                              |
| GET            | `/:tripId`                          | Admin; detail with seasons, itinerary and images |
| POST           | `/`                                 | Admin; create, optional multipart `coverImage`   |
| PATCH          | `/:tripId`                          | Admin; partial update, optional `coverImage`     |
| DELETE         | `/:tripId`                          | Admin; delete with related itinerary/images      |
| PATCH          | `/bulk/publish`                     | Admin; `{ ids: string[] }`                       |
| DELETE         | `/bulk`                             | Admin; `{ ids: string[] }`                       |
| POST           | `/:tripId/itineraries`              | Admin; add day                                   |
| PATCH / DELETE | `/:tripId/itineraries/:itineraryId` | Admin; update/delete owned day                   |
| POST           | `/:tripId/images`                   | Admin; multipart `images`, 1–5 files             |
| PATCH / DELETE | `/:tripId/images/:imageId`          | Admin; update/delete owned image                 |

Create requires `name`, `tripType`, `regionId`, `difficulty` and `durationDays`.
`vehicleDetails`, `distanceKm`, starting/ending points and the shared planning
fields are optional. For example:

```json
{
  "name": "Kumaon Road Journey",
  "tripType": "ROAD",
  "regionId": "<region UUID>",
  "difficulty": "EASY",
  "durationDays": 4,
  "status": "DRAFT",
  "vehicleDetails": "Operator-confirmed vehicle and pickup details"
}
```

Authenticated routes use the existing access-token middleware; invalid inputs
return 400, unauthenticated writes are rejected, and unknown records return 404.
Public reads use the shared rate limiter. No external service is needed for
creating or editing text-only trips; image uploads use Cloudinary.

Enquiries accept an optional `tripId`, mutually exclusive with `trekId` and
`expeditionId`. Dashboard summaries include `publishedTrips`.

Apply the additive Prisma migration before deploying the API. It adds `trip`,
`trip_season`, `trip_itinerary`, `trip_image`, and a nullable `contact.trip_id`;
existing trek/expedition records remain in their original tables.
