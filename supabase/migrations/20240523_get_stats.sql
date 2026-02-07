create or replace function get_system_stats()
returns json
language plpgsql
security definer
as $$
declare
  db_size text;
  storage_size text;
  db_bytes bigint;
  storage_bytes bigint;
begin
  -- Get DB size
  select pg_database_size(current_database()) into db_bytes;
  select pg_size_pretty(db_bytes) into db_size;
  
  -- Get Storage size
  select sum((metadata->>'size')::bigint) 
  into storage_bytes 
  from storage.objects;
  
  if storage_bytes is null then
    storage_bytes := 0;
  end if;
  
  select pg_size_pretty(storage_bytes) into storage_size;

  return json_build_object(
    'db_size', db_size,
    'db_bytes', db_bytes,
    'storage_size', storage_size,
    'storage_bytes', storage_bytes
  );
end;
$$;