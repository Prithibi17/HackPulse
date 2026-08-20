import { NextRequest, NextResponse } from 'next/server';
import { getHackathonBySlug } from '@/lib/services/hackathon.service';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const hackathon = await getHackathonBySlug(slug);

    if (!hackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }

    return NextResponse.json(hackathon);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const existing = await prisma.hackathon.findUnique({
      where: { slug },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 });
    }

    // Record change log if postponed or dates updated
    if (body.isPostponed && !existing.isPostponed) {
      await prisma.hackathonChange.create({
        data: {
          hackathonId: existing.id,
          field: 'isPostponed',
          previousValue: 'false',
          newValue: 'true',
          source: 'ADMIN_OVERRIDE',
        },
      });
    }

    if (body.eventStartDate && existing.eventStartDate) {
      await prisma.hackathonChange.create({
        data: {
          hackathonId: existing.id,
          field: 'eventStartDate',
          previousValue: existing.eventStartDate.toISOString(),
          newValue: new Date(body.eventStartDate).toISOString(),
          source: 'ADMIN_OVERRIDE',
        },
      });
    }

    const updated = await prisma.hackathon.update({
      where: { slug },
      data: {
        ...body,
        eventStartDate: body.eventStartDate ? new Date(body.eventStartDate) : undefined,
        eventEndDate: body.eventEndDate ? new Date(body.eventEndDate) : undefined,
        registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
      },
    });

    // Record audit log
    await prisma.adminAuditLog.create({
      data: {
        action: 'HACKATHON_UPDATE',
        entityType: 'Hackathon',
        entityId: existing.id,
        details: JSON.stringify(body),
        performedBy: 'ADMIN',
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
