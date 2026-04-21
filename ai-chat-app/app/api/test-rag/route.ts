export async function GET() {
  return new Response(
    JSON.stringify({
      error: "The temporary RAG test route is disabled.",
    }),
    {
      status: 501,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

