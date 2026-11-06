// Run from backend: node --import tsx tests/trips.integration.ts
// Uses the local development database and removes only records created here.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';
import { env } from '../src/config/env.config.js';
import { signAccessToken } from '../src/utils/auth/jwt.js';
import { createContactSchema } from '../src/modules/contact/contact.schema.js';

assert.ok(
  ['localhost', '127.0.0.1', '[::1]'].includes(new URL(env.DATABASE_URL).hostname),
  'Use a local development database for this integration check.',
);

const run = randomUUID();
const ids: string[] = [];
let regionId: string | undefined;
let seasonId: string | undefined;
let contactId: string | undefined;
const server = app.listen(0, '127.0.0.1');
await once(server, 'listening');
const address = server.address();
assert.ok(address && typeof address !== 'string');
const origin = `http://127.0.0.1:${address.port}/api/v1`;
let token = '';
let checks = 0;

async function request(method: string, route: string, status: number, body?: unknown, auth = true) {
  const response = await fetch(`${origin}${route}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15_000),
  });
  const result = await response.json();
  assert.equal(response.status, status, `${method} ${route}: ${JSON.stringify(result)}`);
  checks++;
  return result.data;
}

try {
  const admin = await prisma.admin.findFirst({ where: { isActive: true } });
  assert.ok(admin, 'Seed a local admin before running this check.');
  token = signAccessToken({ id: admin.id, email: admin.email, type: 'access' });
  const region = await prisma.region.create({
    data: { name: 'Trip integration test', slug: `test-${run}` },
  });
  regionId = region.id;
  const season = await prisma.season.create({ data: { name: 'Test season', slug: `test-${run}` } });
  seasonId = season.id;
  const input = {
    name: `Integration Journey ${run}`,
    tripType: 'ROAD',
    regionId,
    seasonIds: [seasonId],
    difficulty: 'EASY',
    durationDays: 3,
    distanceKm: 250,
    price: 9000,
    vehicleDetails: 'Test vehicle arrangements',
    meetingPoint: 'Test pickup',
  };
  await request('POST', '/trips', 401, input, false);
  await request('GET', '/trips/admin', 401, undefined, false);
  await request('POST', '/trips', 400, { ...input, tripType: 'FLIGHT' });
  const { tripType: _, ...missingType } = input;
  await request('POST', '/trips', 400, missingType);
  await request('POST', '/trips', 400, { ...input, vehicleDetails: 'x'.repeat(5001) });
  const road = await request('POST', '/trips', 201, input);
  ids.push(road.id);
  assert.equal(road.status, 'DRAFT');
  assert.equal(road.tripType, 'ROAD');
  assert.equal(road.seasons[0].seasonId, seasonId);
  await request('GET', `/trips/slug/${road.slug}`, 404, undefined, false);
  const bike = await request('POST', '/trips', 201, { ...input, tripType: 'BIKE' });
  ids.push(bike.id);
  assert.notEqual(road.slug, bike.slug, 'Duplicate names must produce distinct slugs');
  const day = await request('POST', `/trips/${road.id}/itineraries`, 201, {
    dayNumber: 1,
    title: 'First drive',
    distanceKm: 80,
  });
  await request('POST', `/trips/${road.id}/itineraries`, 409, { dayNumber: 1, title: 'Duplicate' });
  await request('PATCH', `/trips/${bike.id}/itineraries/${day.id}`, 404, { title: 'Wrong parent' });
  await request('PATCH', `/trips/${road.id}/itineraries/${day.id}`, 200, {
    title: 'Updated drive',
  });
  const detail = await request('GET', `/trips/${road.id}`, 200);
  assert.equal(detail.itineraries[0].title, 'Updated drive');
  await request('PATCH', `/trips/${road.id}`, 200, {
    status: 'PUBLISHED',
    vehicleDetails: 'Updated vehicle',
    seasonIds: [],
  });
  const published = await request('GET', `/trips/slug/${road.slug}`, 200, undefined, false);
  assert.ok(published.publishedAt);
  assert.equal(published.vehicleDetails, 'Updated vehicle');
  assert.equal(published.seasons.length, 0);
  assert.equal('createdBy' in published, false);
  const listing = await request('GET', '/trips', 200, undefined, false);
  assert.ok(
    listing.some(
      (trip: { id: string; tripType: string }) => trip.id === road.id && trip.tripType === 'ROAD',
    ),
  );
  assert.ok(!listing.some((trip: { id: string }) => trip.id === bike.id));
  const bulk = await request('PATCH', '/trips/bulk/publish', 200, { ids: [road.id, bike.id] });
  assert.equal(bulk.updatedCount, 1);
  const summary = await request('GET', '/dashboard/summary', 200);
  assert.equal(typeof summary.publishedTrips, 'number');
  await request('PATCH', `/trips/${bike.id}`, 200, { status: 'ARCHIVED' });
  await request('GET', `/trips/slug/${bike.slug}`, 404, undefined, false);
  const enquiry = {
    name: 'Integration test',
    email: 'test@example.invalid',
    message: 'Test enquiry',
    tripId: road.id,
  };
  assert.ok(createContactSchema.safeParse(enquiry).success);
  assert.equal(createContactSchema.safeParse({ ...enquiry, trekId: randomUUID() }).success, false);
  const contact = await prisma.contact.create({ data: enquiry, include: { trip: true } });
  contactId = contact.id;
  assert.equal(contact.trip?.id, road.id);
  const inbox = await request('GET', `/enquiries/${contact.id}`, 200);
  assert.equal(inbox.trip.name, input.name);
  await request('DELETE', `/trips/${road.id}/itineraries/${day.id}`, 200);
  await request('DELETE', `/trips/${road.id}`, 200);
  assert.equal(
    (await prisma.contact.findUniqueOrThrow({ where: { id: contact.id } })).tripId,
    null,
  );
  await request('GET', `/trips/${road.id}`, 404);
  const deleted = await request('DELETE', '/trips/bulk', 200, { ids: [bike.id] });
  assert.equal(deleted.deletedCount, 1);
  console.log(
    `Trips integration passed: ${checks} HTTP status checks plus publishing, ownership, type, relation and enquiry assertions.`,
  );
} finally {
  if (contactId) await prisma.contact.deleteMany({ where: { id: contactId } });
  if (ids.length) await prisma.trip.deleteMany({ where: { id: { in: ids } } });
  if (seasonId) await prisma.season.deleteMany({ where: { id: seasonId } });
  if (regionId) await prisma.region.deleteMany({ where: { id: regionId } });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
}
