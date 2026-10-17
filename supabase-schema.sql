-- Mi Despensa - Esquema de base de datos para Supabase
-- Ejecuta este SQL en el SQL Editor de tu proyecto de Supabase

-- ============================================
-- TABLAS
-- ============================================

-- Perfiles de usuario
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Casas
create table public.houses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Miembros de casas (relación muchos a muchos)
create table public.house_members (
  id uuid primary key default uuid_generate_v4(),
  house_id uuid references public.houses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'member', 'viewer')) default 'member' not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(house_id, user_id)
);

-- Ubicaciones dentro de una casa
create table public.locations (
  id uuid primary key default uuid_generate_v4(),
  house_id uuid references public.houses(id) on delete cascade not null,
  name text not null,
  description text,
  nfc_url text unique,
  icon text default '📦',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Productos
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references public.locations(id) on delete cascade not null,
  name text not null,
  product_type text check (product_type in ('food', 'medicine', 'cleaning', 'bathroom', 'other')) default 'food',
  category text default 'otros',
  quantity numeric not null default 1,
  unit text default 'ud',
  expiration_date date,
  opened_date date,
  dosage text,
  frequency text,
  fill_level text check (fill_level in ('full', 'medium', 'low', 'empty')),
  barcode text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Recetas generadas por IA
create table public.recipes (
  id uuid primary key default uuid_generate_v4(),
  house_id uuid references public.houses(id) on delete cascade not null,
  title text not null,
  description text,
  ingredients jsonb not null,
  instructions jsonb not null,
  cooking_time integer,
  servings integer,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ÍNDICES
-- ============================================

create index idx_house_members_house on public.house_members(house_id);
create index idx_house_members_user on public.house_members(user_id);
create index idx_locations_house on public.locations(house_id);
create index idx_products_location on public.products(location_id);
create index idx_products_expiration on public.products(expiration_date);
create index idx_products_category on public.products(category);
create index idx_recipes_house on public.recipes(house_id);

-- ============================================
-- FUNCIONES
-- ============================================

-- Función para actualizar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Triggers para updated_at
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger on_house_updated
  before update on public.houses
  for each row execute procedure public.handle_updated_at();

create trigger on_location_updated
  before update on public.locations
  for each row execute procedure public.handle_updated_at();

create trigger on_product_updated
  before update on public.products
  for each row execute procedure public.handle_updated_at();

-- Función para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para crear perfil al registrarse
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.house_members enable row level security;
alter table public.locations enable row level security;
alter table public.products enable row level security;
alter table public.recipes enable row level security;

-- ============================================
-- POLICIES
-- ============================================

-- Profiles: usuarios pueden ver y editar su propio perfil
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Houses: miembros pueden ver sus casas
create policy "Members can view their houses"
  on public.houses for select
  using (
    id in (
      select house_id from public.house_members
      where user_id = auth.uid()
    )
  );

create policy "Members can update their houses"
  on public.houses for update
  using (
    id in (
      select house_id from public.house_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can create houses"
  on public.houses for insert
  with check (auth.uid() = created_by);

create policy "Admins can delete houses"
  on public.houses for delete
  using (
    id in (
      select house_id from public.house_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- House members: ver miembros de tus casas
create policy "Members can view house members"
  on public.house_members for select
  using (
    house_id in (
      select house_id from public.house_members
      where user_id = auth.uid()
    )
  );

create policy "Admins can manage house members"
  on public.house_members for all
  using (
    house_id in (
      select house_id from public.house_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Locations: miembros pueden ver ubicaciones de sus casas
create policy "Members can view locations"
  on public.locations for select
  using (
    house_id in (
      select house_id from public.house_members
      where user_id = auth.uid()
    )
  );

create policy "Members can manage locations"
  on public.locations for all
  using (
    house_id in (
      select house_id from public.house_members
      where user_id = auth.uid()
    )
  );

-- Products: miembros pueden ver productos de sus casas
create policy "Members can view products"
  on public.products for select
  using (
    location_id in (
      select l.id from public.locations l
      join public.house_members hm on l.house_id = hm.house_id
      where hm.user_id = auth.uid()
    )
  );

create policy "Members can manage products"
  on public.products for all
  using (
    location_id in (
      select l.id from public.locations l
      join public.house_members hm on l.house_id = hm.house_id
      where hm.user_id = auth.uid()
    )
  );

-- Recipes: miembros pueden ver recetas de sus casas
create policy "Members can view recipes"
  on public.recipes for select
  using (
    house_id in (
      select house_id from public.house_members
      where user_id = auth.uid()
    )
  );

create policy "Members can manage recipes"
  on public.recipes for all
  using (
    house_id in (
      select house_id from public.house_members
      where user_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE (para avatares y otros archivos)
-- ============================================

-- Crear bucket para avatares
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Policy para avatares: usuarios pueden subir su propio avatar
create policy "Users can upload their avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- ============================================
-- NOTIFICACIONES (opcional - para alertas de caducidad)
-- ============================================

-- Tabla para configuración de notificaciones
create table public.notification_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  house_id uuid references public.houses(id) on delete cascade not null,
  email_notifications boolean default true,
  push_notifications boolean default true,
  days_before_expiry integer default 3,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, house_id)
);

alter table public.notification_settings enable row level security;

create policy "Users can manage their notification settings"
  on public.notification_settings for all
  using (user_id = auth.uid());

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================

-- Notas:
-- 1. Este esquema incluye todas las tablas necesarias para la app
-- 2. Los índices optimizan las consultas más comunes
-- 3. Los triggers mantienen updated_at actualizado automáticamente
-- 4. RLS asegura que los usuarios solo accedan a sus datos
-- 5. La función handle_new_user crea perfiles automáticamente
-- 6. Storage bucket para avatares de usuario
-- 7. Tabla de notificaciones preparada para alertas

-- Para ejecutar:
-- 1. Ve a tu proyecto de Supabase
-- 2. Abre el SQL Editor
-- 3. Copia y pega este script
-- 4. Ejecútalo
-- 5. ¡Listo! Tu base de datos está configurada
