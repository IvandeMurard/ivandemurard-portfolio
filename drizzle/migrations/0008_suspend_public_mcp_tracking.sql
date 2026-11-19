REVOKE EXECUTE ON FUNCTION public.log_mcp_call(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_mcp_call(text, text) TO service_role;
COMMENT ON FUNCTION public.log_mcp_call(text, text) IS 'MCP tracking suspended: public execution revoked. Historical events are unverified and must not be cited as usage evidence. No server tracking path is enabled.';