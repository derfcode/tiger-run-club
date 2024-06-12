-- Create the actions table
create table if not exists actions (
  id serial primary key,
  email text not null,
  created_at timestamp with time zone default now()
);

-- Function to insert a new user
create or replace function insert_new_user()
returns trigger
language plpgsql
as $$
begin
  -- Ensure the email is unique for non-SSO users
  insert into auth.users (id, email, created_at, is_sso_user)
  values (uuid_generate_v4(), new.email, now(), false)
  on conflict (email) where is_sso_user = false do nothing;
  return new;
end;
$$;

-- Trigger to call the insert_new_user function
create trigger user_insert_trigger
after insert on actions
for each row
execute function insert_new_user();

-- Grant necessary permissions to the anon role
grant insert, select, update, delete on table actions to anon;
grant insert, select, update, delete on table auth.users to anon;