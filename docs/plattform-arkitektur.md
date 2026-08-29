# Vebpartner – plattformsarkitektur

## Mål
Vebpartner ska utvecklas från en kodbaserad katalog till en datadriven marknadsplats för affärsmöjligheter.

Besökare ska kunna upptäcka och jämföra möjligheter. Inloggade användare ska kunna spara möjligheter och skicka intresseanmälningar. Företag ska senare kunna skapa och hantera egna företagsprofiler och skicka in möjligheter för granskning.

## Ansvar per lager

### Vebpartner-appen
React/Vite-frontenden behålls och utvecklas vidare i stället för att byggas om från noll.

### Supabase
Supabase blir det långsiktiga datalagret för:

- användarprofiler
- företag
- kategorier
- affärsmöjligheter
- favoriter
- intresseanmälningar
- inskickade förslag

### GitBook
GitBook används som separat kunskapslager för fördjupande guider. En möjlighet i Vebpartner kan ha `guide_url` som pekar på motsvarande guide.

### GitHub
GitHub är källan för kod, databas-migrationer och förändringshistorik.

## Första datamodellen
Databasschemat finns i `supabase/migrations/001_vebpartner_plattform.sql`.

De viktigaste relationerna är:

- `companies` 1 → många `opportunities`
- `opportunities` många ↔ många `categories`
- `profiles` 1 → många `favorites`
- `profiles` 1 → många `interest_requests`
- `opportunities` 1 → många `interest_requests`

## Säkerhetsmodell
Alla tabeller i `public` använder Row Level Security.

Publikt kan endast publicerade företag, aktiva kategorier och publicerade möjligheter läsas. Favoriter och intresseanmälningar är privata per användare. Företagsägare får endast hantera sina egna företagsdata. En användare som skickat in en möjlighet får endast hantera sitt eget opublicerade material.

Administratörsrättigheter ska inte baseras på användarstyrd metadata. Adminflödet byggs separat med serverkontrollerad behörighet.

## Migreringsordning

1. Skapa ett separat Supabase-projekt för Vebpartner.
2. Applicera första migrationen och kör Supabase Security/Performance Advisors.
3. Lägg till Supabase-klienten i appen med publishable key, aldrig service-role i webbläsaren.
4. Importera dagens kategorier och listings från `src/data` till Supabase.
5. Läsa katalogen från Supabase med fallback till nuvarande statiska data under övergången.
6. Bygga autentisering och profiler.
7. Bygga favoriter.
8. Bygga intresseanmälningar.
9. Bygga företagskonton och granskningsflöde.
10. Koppla GitBook-guider till respektive möjlighet.

## Princip
Ingen omstart av frontend. Funktionalitet flyttas stegvis från statisk kod/Firebase till plattformslagret så att den befintliga sajten kan fortsätta fungera under migreringen.
