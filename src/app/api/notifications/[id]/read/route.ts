import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeNotification } from "@/lib/serializers.server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notification = await prisma.notification.update({ where: { id }, data: { read: true } });
  return NextResponse.json(serializeNotification(notification));
}
