import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuizzValidator } from "@/lib/validators/quizz";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = QuizzValidator.parse(body);

    const quizzExists = await db.quizz.findFirst({
      where: {
        name,
      },
    });

    if (quizzExists) {
      return new Response("Quizz session with same name already exists", {
        status: 409,
      });
    }

    const quizz = await db.quizz.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        quizzId: quizz.id,
      },
    });

    return new Response(quizz.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create quizz session", { status: 500 });
  }
}
