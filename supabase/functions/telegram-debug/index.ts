const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN missing");

    const meRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const me = await meRes.json();

    const upRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    const updates = await upRes.json();

    const chats = (updates.result ?? []).map((u: any) => {
      const m = u.message ?? u.edited_message ?? u.channel_post ?? {};
      return {
        update_id: u.update_id,
        chat_id: m.chat?.id,
        chat_type: m.chat?.type,
        chat_title: m.chat?.title ?? m.chat?.username ?? `${m.chat?.first_name ?? ""} ${m.chat?.last_name ?? ""}`.trim(),
        from: m.from?.username ?? m.from?.first_name,
        text: m.text,
      };
    });

    return new Response(
      JSON.stringify({
        configured_chat_id: CHAT_ID,
        configured_chat_id_length: CHAT_ID?.length,
        bot: me.result,
        recent_chats: chats,
        raw_updates_count: updates.result?.length ?? 0,
      }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
