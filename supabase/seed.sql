-- Supabase PostgreSQL Seed Script: Global Authentic Places
-- Covers: Tokyo, Paris, New York, Barcelona, Bali, Istanbul

-- 0. Insert Test User in auth.users (which triggers creation of public.profiles)
DO $$
BEGIN
  insert into auth.users (id, email, raw_user_meta_data, aud, role)
  values ('00000000-0000-0000-0000-000000000000', 'testuser@sroute.com', '{"name": "Test User", "full_name": "Test User", "avatar_url": ""}'::jsonb, 'authenticated', 'authenticated')
  on conflict (id) do nothing;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping auth.users seed insert due to error: %', SQLERRM;
END;
$$;

-- Ensure a profile row exists for the test user (in case the trigger didn't fire)
insert into public.profiles (id, username, full_name)
values ('00000000-0000-0000-0000-000000000000', 'testuser', 'Test User')
on conflict (id) do nothing;

-- =========================================
-- TOKYO, JAPAN
-- =========================================
insert into public.places (id, name, description, category, location, address, city, country, price_level, opening_hours, average_rating, review_count, metadata)
values
  (
    'a0000001-0000-0000-0000-000000000001',
    'Ramen Haruka',
    'A legendary basement-level ramen counter serving thick, authentic tonkotsu broth. English menu is non-existent, and ordering is done via a Japanese vending machine.',
    'restaurant',
    'POINT(139.7714 35.6984)'::geography,
    '1 Chome-3-10 Sotokanda, Chiyoda City, Tokyo',
    'Tokyo',
    'Japan',
    1,
    '{"monday": "11:00-22:00", "tuesday": "11:00-22:00", "wednesday": "11:00-22:00", "thursday": "11:00-22:00", "friday": "11:00-23:00", "saturday": "11:00-23:00", "sunday": "11:00-21:00"}'::jsonb,
    4.8,
    42,
    '{"cuisine": "Ramen", "signature_dish": "Garlic Tonkotsu Ramen"}'::jsonb
  ),
  (
    'a0000001-0000-0000-0000-000000000002',
    'Sushi Kanesaka',
    'Ultra-authentic Ginza sushi experience run by master chef Shinji Kanesaka. Strictly traditional Edo-mae preparation, seating only 10 guests.',
    'restaurant',
    'POINT(139.7618 35.6702)'::geography,
    '8 Chome-10-3 Ginza, Chuo City, Tokyo',
    'Tokyo',
    'Japan',
    4,
    '{"tuesday": "12:00-14:00, 17:00-22:00", "wednesday": "12:00-14:00, 17:00-22:00", "thursday": "12:00-14:00, 17:00-22:00", "friday": "12:00-14:00, 17:00-22:00", "saturday": "12:00-14:00, 17:00-22:00", "sunday": "12:00-14:00, 17:00-22:00"}'::jsonb,
    4.9,
    115,
    '{"cuisine": "Sushi / Omakase", "michelin_stars": 2}'::jsonb
  ),
  (
    'a0000001-0000-0000-0000-000000000003',
    'Nezu Shrine Garden',
    'One of Japan''s oldest shrines, famous for its winding path of red Torii gates and peaceful azalea garden. Far fewer tourists than Fushimi Inari.',
    'attraction',
    'POINT(139.7607 35.7202)'::geography,
    '1 Chome-28-9 Nezu, Bunkyo City, Tokyo',
    'Tokyo',
    'Japan',
    1,
    '{"monday": "06:00-17:00", "tuesday": "06:00-17:00", "wednesday": "06:00-17:00", "thursday": "06:00-17:00", "friday": "06:00-17:00", "saturday": "06:00-17:00", "sunday": "06:00-17:00"}'::jsonb,
    4.7,
    89,
    '{"entry_fee": "Free", "best_season": "Spring (Azalea bloom)"}'::jsonb
  ),
  (
    'a0000001-0000-0000-0000-000000000004',
    'Café de L''Ambre',
    'A coffee temple in Ginza serving exclusively single-origin, aged coffee beans since 1948. Original master''s family still roasting daily.',
    'cafe',
    'POINT(139.7632 35.6698)'::geography,
    '8 Chome-10-15 Ginza, Chuo City, Tokyo',
    'Tokyo',
    'Japan',
    2,
    '{"tuesday": "12:00-22:00", "wednesday": "12:00-22:00", "thursday": "12:00-22:00", "friday": "12:00-22:00", "saturday": "12:00-22:00", "sunday": "12:00-19:00"}'::jsonb,
    4.7,
    212,
    '{"signature": "Amber Queen (Aged iced coffee with sweet milk)"}'::jsonb
  ),
  (
    'a0000001-0000-0000-0000-000000000005',
    'Ryokan Kamogawa Asakusa',
    'A beautiful, family-owned traditional ryokan with tatami mats, futon bedding, and an authentic communal hot spring bath near Senso-ji.',
    'hotel',
    'POINT(139.7958 35.7118)'::geography,
    '1 Chome-29-8 Asakusa, Taito City, Tokyo',
    'Tokyo',
    'Japan',
    3,
    null,
    4.6,
    57,
    '{"bath_type": "Onsen-style hot bath", "meal_included": "Optional Traditional Breakfast"}'::jsonb
  );

-- =========================================
-- PARIS, FRANCE
-- =========================================
insert into public.places (id, name, description, category, location, address, city, country, price_level, opening_hours, average_rating, review_count, metadata)
values
  (
    'b0000001-0000-0000-0000-000000000001',
    'Le Baratin',
    'A beloved neighborhood bistro in Belleville run by Argentine chef Raquel Carena. Handwritten menu changes daily based on market finds. Locals-only crowd.',
    'restaurant',
    'POINT(2.3883 48.8717)'::geography,
    '3 Rue Jouye-Rouve, 75020 Paris',
    'Paris',
    'France',
    2,
    '{"tuesday": "12:00-14:30, 20:00-23:00", "wednesday": "12:00-14:30, 20:00-23:00", "thursday": "12:00-14:30, 20:00-23:00", "friday": "12:00-14:30, 20:00-23:00", "saturday": "20:00-23:00"}'::jsonb,
    4.6,
    187,
    '{"cuisine": "French Bistro", "specialty": "Natural wines, seasonal tasting menu"}'::jsonb
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'Musée de la Chasse et de la Nature',
    'A quirky, offbeat museum in Le Marais housed in two historic mansions. Artistic taxidermy, contemporary art installations, and zero tour buses.',
    'museum',
    'POINT(2.3578 48.8614)'::geography,
    '62 Rue des Archives, 75003 Paris',
    'Paris',
    'France',
    1,
    '{"tuesday": "11:00-18:00", "wednesday": "11:00-21:00", "thursday": "11:00-18:00", "friday": "11:00-18:00", "saturday": "11:00-18:00", "sunday": "11:00-18:00"}'::jsonb,
    4.5,
    98,
    '{"entry_fee": "8 EUR", "highlights": "Cabinet of curiosities rooms"}'::jsonb
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'Boot Café',
    'A tiny, standing-room-only specialty coffee bar in a former cobbler''s shop. One of the pioneers of Paris'' third-wave coffee scene.',
    'cafe',
    'POINT(2.3654 48.8634)'::geography,
    '19 Rue du Pont aux Choux, 75003 Paris',
    'Paris',
    'France',
    1,
    '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-17:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'::jsonb,
    4.4,
    156,
    '{"specialty": "Single-origin pour-over", "size": "Standing room only, 6 people max"}'::jsonb
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'Parc des Buttes-Chaumont',
    'A sprawling, hilly park in northeastern Paris with waterfalls, a suspended bridge, and stunning hilltop views. Entirely local, zero tourist crowds.',
    'park',
    'POINT(2.3822 48.8809)'::geography,
    '1 Rue Botzaris, 75019 Paris',
    'Paris',
    'France',
    1,
    '{"monday": "07:00-22:00", "tuesday": "07:00-22:00", "wednesday": "07:00-22:00", "thursday": "07:00-22:00", "friday": "07:00-22:00", "saturday": "07:00-22:00", "sunday": "07:00-22:00"}'::jsonb,
    4.7,
    312,
    '{"entry_fee": "Free", "highlights": "Temple de la Sibylle viewpoint"}'::jsonb
  );

-- =========================================
-- NEW YORK, USA
-- =========================================
insert into public.places (id, name, description, category, location, address, city, country, price_level, opening_hours, average_rating, review_count, metadata)
values
  (
    'c0000001-0000-0000-0000-000000000001',
    'Di Fara Pizza',
    'Legendary Brooklyn pizzeria where 80+ year old Dom DeMarco still hand-makes every single pie. Cash only, long waits, worth every minute.',
    'restaurant',
    'POINT(-73.9613 40.6250)'::geography,
    '1424 Avenue J, Brooklyn, NY 11230',
    'New York',
    'USA',
    1,
    '{"wednesday": "12:00-20:00", "thursday": "12:00-20:00", "friday": "12:00-20:00", "saturday": "12:00-20:00", "sunday": "12:00-20:00"}'::jsonb,
    4.5,
    520,
    '{"cuisine": "Pizza", "payment": "Cash only", "wait_time": "45-90 minutes typical"}'::jsonb
  ),
  (
    'c0000001-0000-0000-0000-000000000002',
    'The Cloisters',
    'A medieval European monastery reassembled stone-by-stone in Fort Tryon Park, housing the Met''s medieval art collection. Feels like stepping into 13th-century France.',
    'museum',
    'POINT(-73.9319 40.8649)'::geography,
    '99 Margaret Corbin Dr, New York, NY 10040',
    'New York',
    'USA',
    2,
    '{"thursday": "10:00-17:15", "friday": "10:00-17:15", "saturday": "10:00-17:15", "sunday": "10:00-17:15", "monday": "10:00-17:15"}'::jsonb,
    4.8,
    890,
    '{"entry_fee": "Pay what you wish", "highlights": "Unicorn Tapestries, herb garden"}'::jsonb
  ),
  (
    'c0000001-0000-0000-0000-000000000003',
    'Russ & Daughters',
    'An iconic appetizing shop on the Lower East Side since 1914. Locals line up for hand-sliced smoked salmon, cream cheese, and bagels.',
    'restaurant',
    'POINT(-73.9882 40.7225)'::geography,
    '179 E Houston St, New York, NY 10002',
    'New York',
    'USA',
    2,
    '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "08:00-17:00", "sunday": "08:00-17:00"}'::jsonb,
    4.7,
    1024,
    '{"cuisine": "Jewish Deli / Appetizing", "established": 1914}'::jsonb
  ),
  (
    'c0000001-0000-0000-0000-000000000004',
    'Green-Wood Cemetery',
    'A stunning 478-acre National Historic Landmark in Brooklyn with rolling hills, ponds, and Gothic architecture. More peaceful than Central Park.',
    'park',
    'POINT(-73.9903 40.6582)'::geography,
    '500 25th St, Brooklyn, NY 11232',
    'New York',
    'USA',
    1,
    '{"monday": "07:00-19:00", "tuesday": "07:00-19:00", "wednesday": "07:00-19:00", "thursday": "07:00-19:00", "friday": "07:00-19:00", "saturday": "07:00-19:00", "sunday": "07:00-19:00"}'::jsonb,
    4.8,
    245,
    '{"entry_fee": "Free", "highlights": "Gothic arch entrance, Battle Hill panoramic views"}'::jsonb
  );

-- =========================================
-- BARCELONA, SPAIN
-- =========================================
insert into public.places (id, name, description, category, location, address, city, country, price_level, opening_hours, average_rating, review_count, metadata)
values
  (
    'd0000001-0000-0000-0000-000000000001',
    'Cal Pep',
    'A legendary tapas counter bar near the waterfront where chef Pep serves explosive Catalan seafood. Elbow-to-elbow with locals, no reservations for the bar.',
    'restaurant',
    'POINT(2.1819 41.3835)'::geography,
    'Plaça de les Olles, 8, 08003 Barcelona',
    'Barcelona',
    'Spain',
    3,
    '{"tuesday": "13:00-15:45, 19:30-23:30", "wednesday": "13:00-15:45, 19:30-23:30", "thursday": "13:00-15:45, 19:30-23:30", "friday": "13:00-15:45, 19:30-23:30", "saturday": "13:00-15:45"}'::jsonb,
    4.6,
    380,
    '{"cuisine": "Catalan Tapas / Seafood", "signature": "Fried baby squid, clams a la plancha"}'::jsonb
  ),
  (
    'd0000001-0000-0000-0000-000000000002',
    'Bunkers del Carmel',
    'Anti-aircraft bunkers from the Spanish Civil War perched atop Turó de la Rovira hill. Offers 360° panoramic views of Barcelona—a true local secret.',
    'attraction',
    'POINT(2.1617 41.4189)'::geography,
    'Carrer de Marià Labèrnia, s/n, 08032 Barcelona',
    'Barcelona',
    'Spain',
    1,
    '{"monday": "00:00-23:59", "tuesday": "00:00-23:59", "wednesday": "00:00-23:59", "thursday": "00:00-23:59", "friday": "00:00-23:59", "saturday": "00:00-23:59", "sunday": "00:00-23:59"}'::jsonb,
    4.8,
    215,
    '{"entry_fee": "Free", "best_time": "Sunset"}'::jsonb
  ),
  (
    'd0000001-0000-0000-0000-000000000003',
    'Satan''s Coffee Corner',
    'A minimalist specialty coffee shop in El Born with zero Wi-Fi (intentional), perfect espresso, and a rebellious local vibe.',
    'cafe',
    'POINT(2.1813 41.3852)'::geography,
    'Carrer de l''Arc de Sant Ramon del Call, 11, 08002 Barcelona',
    'Barcelona',
    'Spain',
    1,
    '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-17:00", "saturday": "10:00-17:00", "sunday": "10:00-17:00"}'::jsonb,
    4.3,
    178,
    '{"specialty": "Espresso-based drinks", "policy": "No Wi-Fi by design"}'::jsonb
  );

-- =========================================
-- BALI, INDONESIA
-- =========================================
insert into public.places (id, name, description, category, location, address, city, country, price_level, opening_hours, average_rating, review_count, metadata)
values
  (
    'e0000001-0000-0000-0000-000000000001',
    'Warung Babi Guling Ibu Oka',
    'Anthony Bourdain''s favorite Balinese roast suckling pig warung in Ubud. Packed with locals during lunch, served until it runs out.',
    'restaurant',
    'POINT(115.2635 -8.5069)'::geography,
    'Jl. Tegal Sari No.2, Ubud, Gianyar, Bali',
    'Bali',
    'Indonesia',
    1,
    '{"monday": "11:00-15:00", "tuesday": "11:00-15:00", "wednesday": "11:00-15:00", "thursday": "11:00-15:00", "friday": "11:00-15:00", "saturday": "11:00-15:00", "sunday": "11:00-15:00"}'::jsonb,
    4.5,
    340,
    '{"cuisine": "Balinese", "signature_dish": "Babi Guling (roast suckling pig)", "note": "Sells out daily by 2pm"}'::jsonb
  ),
  (
    'e0000001-0000-0000-0000-000000000002',
    'Tirta Empul Temple',
    'A sacred Balinese Hindu water temple where locals perform purification rituals in natural spring pools. Deeply spiritual and genuine.',
    'attraction',
    'POINT(115.3155 -8.4153)'::geography,
    'Jl. Tirta, Manukaya, Tampaksiring, Gianyar, Bali',
    'Bali',
    'Indonesia',
    1,
    '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "08:00-18:00", "sunday": "08:00-18:00"}'::jsonb,
    4.6,
    267,
    '{"entry_fee": "50000 IDR", "dress_code": "Sarong required", "best_time": "Early morning before 9am"}'::jsonb
  ),
  (
    'e0000001-0000-0000-0000-000000000003',
    'Seniman Coffee Studio',
    'An artisan coffee roastery and café in Ubud that sources beans exclusively from Indonesian smallholder farms. Brewing methods on display.',
    'cafe',
    'POINT(115.2614 -8.5046)'::geography,
    'Jl. Sriwedari No.5, Ubud, Gianyar, Bali',
    'Bali',
    'Indonesia',
    1,
    '{"monday": "08:00-23:00", "tuesday": "08:00-23:00", "wednesday": "08:00-23:00", "thursday": "08:00-23:00", "friday": "08:00-23:00", "saturday": "08:00-23:00", "sunday": "08:00-23:00"}'::jsonb,
    4.4,
    189,
    '{"specialty": "Single-origin Indonesian pour-over", "highlights": "Live roasting sessions"}'::jsonb
  );

-- =========================================
-- ISTANBUL, TURKEY
-- =========================================
insert into public.places (id, name, description, category, location, address, city, country, price_level, opening_hours, average_rating, review_count, metadata)
values
  (
    'f0000001-0000-0000-0000-000000000001',
    'Çiya Sofrası',
    'A legendary kebab and meze restaurant in Kadıköy run by chef Musa Dağdeviren, who preserves vanishing Anatolian recipes. Featured in Netflix Chef''s Table.',
    'restaurant',
    'POINT(29.0270 40.9903)'::geography,
    'Caferağa, Güneşli Bahçe Sk. No:43, 34710 Kadıköy/İstanbul',
    'Istanbul',
    'Turkey',
    2,
    '{"monday": "11:00-22:00", "tuesday": "11:00-22:00", "wednesday": "11:00-22:00", "thursday": "11:00-22:00", "friday": "11:00-22:00", "saturday": "11:00-22:00", "sunday": "11:00-22:00"}'::jsonb,
    4.7,
    456,
    '{"cuisine": "Anatolian / Turkish", "signature": "Rotating ancient regional recipes"}'::jsonb
  ),
  (
    'f0000001-0000-0000-0000-000000000002',
    'Chora Church (Kariye Museum)',
    'A 4th-century Byzantine church with the most stunning surviving medieval mosaics and frescoes in the world. Located in a quiet residential neighborhood far from Sultanahmet.',
    'museum',
    'POINT(28.9394 41.0318)'::geography,
    'Dervişali, Kariye Cami Sk. No:18, 34087 Fatih/İstanbul',
    'Istanbul',
    'Turkey',
    1,
    '{"thursday": "09:00-19:00", "friday": "09:00-19:00", "saturday": "09:00-19:00", "sunday": "09:00-19:00", "monday": "09:00-19:00"}'::jsonb,
    4.8,
    312,
    '{"entry_fee": "150 TRY", "highlights": "Byzantine mosaics and frescoes"}'::jsonb
  ),
  (
    'f0000001-0000-0000-0000-000000000003',
    'Mandabatmaz',
    'A tiny sidewalk café in Beyoğlu famous for serving what many consider the best Turkish coffee in Istanbul. Thick, rich, and served on a copper tray.',
    'cafe',
    'POINT(28.9752 41.0338)'::geography,
    'Asmalı Mescit, Olivia Geçidi No:1, 34430 Beyoğlu/İstanbul',
    'Istanbul',
    'Turkey',
    1,
    '{"monday": "10:00-23:00", "tuesday": "10:00-23:00", "wednesday": "10:00-23:00", "thursday": "10:00-23:00", "friday": "10:00-23:00", "saturday": "10:00-23:00", "sunday": "10:00-23:00"}'::jsonb,
    4.6,
    278,
    '{"specialty": "Traditional Turkish coffee", "price": "Under 50 TRY"}'::jsonb
  );

-- =========================================
-- AUTHENTICITY SCORES (All Cities)
-- =========================================

-- Tokyo
insert into public.authenticity_scores (place_id, overall_score, local_ratio, sentiment_score, price_anomaly_score, repeat_visitor_ratio, red_flags, good_signs)
values
  ('a0000001-0000-0000-0000-000000000001', 96.40, 91.20, 95.00, 10.00, 88.50, '{}'::text[], array['No English Menu', 'Basement Location', 'Vending machine payment', 'Owned by local family']),
  ('a0000001-0000-0000-0000-000000000002', 88.20, 65.00, 98.50, 40.00, 45.00, array['Very expensive'], array['Master chef 30 years experience', 'Traditional Edo-style', 'Fish from Toyosu']),
  ('a0000001-0000-0000-0000-000000000003', 94.80, 85.00, 92.00, 0.00, 72.00, '{}'::text[], array['Few tour groups', 'High historical significance', 'Neighborhood locals']),
  ('a0000001-0000-0000-0000-000000000004', 98.10, 93.50, 97.00, 15.00, 89.00, '{}'::text[], array['Aged coffee since 1948', 'Unaltered vintage decor', 'Locals read newspapers']),
  ('a0000001-0000-0000-0000-000000000005', 86.50, 40.00, 91.00, 20.00, 30.00, array['Near tourist zone'], array['Authentic wooden design', 'Traditional tatami', 'Family operated']);

-- Paris
insert into public.authenticity_scores (place_id, overall_score, local_ratio, sentiment_score, price_anomaly_score, repeat_visitor_ratio, red_flags, good_signs)
values
  ('b0000001-0000-0000-0000-000000000001', 95.30, 92.00, 94.50, 12.00, 85.00, '{}'::text[], array['Handwritten daily menu', 'Argentine chef with local following', 'Natural wines']),
  ('b0000001-0000-0000-0000-000000000002', 93.70, 88.00, 91.00, 5.00, 62.00, '{}'::text[], array['No tour buses', 'Contemporary art installations', 'Le Marais hidden gem']),
  ('b0000001-0000-0000-0000-000000000003', 91.20, 86.00, 89.00, 8.00, 78.00, '{}'::text[], array['Former cobbler shop', 'Standing room only', 'Third-wave pioneer']),
  ('b0000001-0000-0000-0000-000000000004', 97.10, 95.00, 96.00, 0.00, 91.00, '{}'::text[], array['Zero tourist crowds', 'Local joggers and families', 'Free entry']);

-- New York
insert into public.authenticity_scores (place_id, overall_score, local_ratio, sentiment_score, price_anomaly_score, repeat_visitor_ratio, red_flags, good_signs)
values
  ('c0000001-0000-0000-0000-000000000001', 94.50, 82.00, 93.00, 5.00, 75.00, array['Long wait times'], array['Owner makes every pie by hand', 'Cash only', 'Brooklyn institution since 1965']),
  ('c0000001-0000-0000-0000-000000000002', 96.80, 78.00, 97.00, 10.00, 55.00, '{}'::text[], array['Far from midtown', 'Medieval art sanctuary', 'Pay what you wish']),
  ('c0000001-0000-0000-0000-000000000003', 95.20, 88.00, 95.00, 12.00, 82.00, '{}'::text[], array['Family-operated since 1914', 'Hand-sliced fish', 'Lower East Side institution']),
  ('c0000001-0000-0000-0000-000000000004', 97.50, 94.00, 96.00, 0.00, 70.00, '{}'::text[], array['National Historic Landmark', 'Free entry', 'More peaceful than Central Park']);

-- Barcelona
insert into public.authenticity_scores (place_id, overall_score, local_ratio, sentiment_score, price_anomaly_score, repeat_visitor_ratio, red_flags, good_signs)
values
  ('d0000001-0000-0000-0000-000000000001', 92.80, 80.00, 93.50, 22.00, 68.00, array['Moderate price'], array['No reservations at bar', 'Chef Pep personally serves', 'Catalan seafood']),
  ('d0000001-0000-0000-0000-000000000002', 96.50, 90.00, 95.00, 0.00, 85.00, '{}'::text[], array['True local secret', '360° views', 'Free', 'Civil War history']),
  ('d0000001-0000-0000-0000-000000000003', 90.40, 87.00, 88.00, 5.00, 76.00, '{}'::text[], array['No Wi-Fi by design', 'Rebellious local vibe', 'Minimalist']);

-- Bali
insert into public.authenticity_scores (place_id, overall_score, local_ratio, sentiment_score, price_anomaly_score, repeat_visitor_ratio, red_flags, good_signs)
values
  ('e0000001-0000-0000-0000-000000000001', 93.60, 85.00, 92.00, 3.00, 80.00, '{}'::text[], array['Sells out daily by 2pm', 'Packed with locals', 'Anthony Bourdain approved']),
  ('e0000001-0000-0000-0000-000000000002', 89.20, 60.00, 90.00, 5.00, 45.00, array['Growing tourist awareness'], array['Active spiritual site', 'Purification rituals still practiced', 'Sacred spring pools']),
  ('e0000001-0000-0000-0000-000000000003', 91.50, 82.00, 90.00, 8.00, 72.00, '{}'::text[], array['Indonesian smallholder beans', 'Live roasting', 'Artisan focus']);

-- Istanbul
insert into public.authenticity_scores (place_id, overall_score, local_ratio, sentiment_score, price_anomaly_score, repeat_visitor_ratio, red_flags, good_signs)
values
  ('f0000001-0000-0000-0000-000000000001', 95.70, 88.00, 96.00, 10.00, 82.00, '{}'::text[], array['Netflix Chef''s Table featured', 'Vanishing Anatolian recipes', 'Kadıköy neighborhood']),
  ('f0000001-0000-0000-0000-000000000002', 97.30, 72.00, 98.00, 5.00, 48.00, '{}'::text[], array['4th-century Byzantine church', 'Residential neighborhood', 'Finest medieval mosaics']),
  ('f0000001-0000-0000-0000-000000000003', 94.10, 91.00, 93.00, 2.00, 88.00, '{}'::text[], array['Best Turkish coffee in city', 'Tiny sidewalk café', 'Copper tray service']);
