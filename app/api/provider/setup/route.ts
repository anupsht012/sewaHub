import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-user";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          error: "Provider profile not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        category: provider.category,
        provider,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET PROVIDER ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (user.role !== "PROVIDER") {
      return NextResponse.json(
        {
          error: "Only providers can create profiles",
        },
        {
          status: 403,
        }
      );
    }

    const { bio, location, category } = await req.json();

    if (!location) {
      return NextResponse.json(
        {
          error: "Location is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Provider category is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingProvider = await prisma.provider.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (existingProvider) {
      return NextResponse.json(
        {
          error: "Provider profile already exists",
        },
        {
          status: 400,
        }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        bio,
        location,
        category,
      },
    });

    return NextResponse.json(
      {
        success: true,
        provider,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("PROVIDER SETUP ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}