import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Supabase env not configured");
    if (!BOT_TOKEN || !CHAT_ID) throw new Error("Telegram env not configured");

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Weekly stats
    const { data: weekRows, error: weekErr } = await supabase
      .from("page_visits")
      .select("path, visitor_id")
      .gte("visited_at", weekAgo);
    if (weekErr) throw weekErr;

    // All-time totals
    const { count: allTimeViews, error: totalErr } = await supabase
      .from("page_visits")
      .select("*", { count: "exact", head: true });
    if (totalErr) throw totalErr;

    const { data: allVisitorsRows, error: allVisErr } = await supabase
      .from("page_visits")
      .select("visitor_id");
    if (allVisErr) throw allVisErr;

    const weeklyViews = weekRows?.length ?? 0;
    const weeklyUnique = new Set((weekRows ?? []).map((r) => r.visitor_id)).size;
    const allTimeUnique = new Set((allVisitorsRows ?? []).map((r) => r.visitor_id)).size;

    // Top pages this week
    const pageCounts: Record<string, number> = {};
    for (const r of weekRows ?? []) {
      pageCounts[r.path] = (pageCounts[r.path] ?? 0) + 1;
    }
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sgFormatter = new Intl.DateTimeFormat("en-SG", {
      timeZone: "Asia/Singapore",
      dateStyle: "medium",
    });

    const lines = [
      `📊 <b>Weekly Visitor Report</b>`,
      `<i>Week ending ${sgFormatter.format(now)} (SGT)</i>`,
      ``,
      `<b>This week</b>`,
      `• Page views: <b>${weeklyViews}</b>`,
      `• Unique visitors: <b>${weeklyUnique}</b>`,
      ``,
      `<b>All time</b>`,
      `• Page views: <b>${allTimeViews ?? 0}</b>`,
      `• Unique visitors: <b>${allTimeUnique}</b>`,
    ];

    if (topPages.length > 0) {
      lines.push(``, `<b>Top pages this week</b>`);
      for (const [path, count] of topPages) {
        lines.push(`• <code>${path}</code> — ${count}`);
      }
    }

    const text = lines.join("\n");

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const tgData = await tgRes.json();
    if (!tgRes.ok) {
      throw new Error(`Telegram error [${tgRes.status}]: ${JSON.stringify(tgData)}`);
    }

    return new Response(
      JSON.stringify({ ok: true, weeklyViews, weeklyUnique, allTimeViews, allTimeUnique }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("weekly-visitor-report error:", msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
