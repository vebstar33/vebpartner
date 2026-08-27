# Vebpartner Business Listing Specification

Selfnamed White-Label Beauty is the canonical quality reference for future curated business listings. Do not change Selfnamed when using this document. New listings should match this information architecture, content depth, formatting discipline, favicon handling, CTA behavior and component usage while preserving the factual differences of each company.

## Canonical Reference

- Reference listing: `selfnamed-white-label-beauty`
- Source file: `src/data/listings/batch03.ts`
- Data contract: `BusinessListing` in `src/data/listings/listing.schema.ts`
- Runtime converter: `businessListingToToolListing`
- Primary card component: `src/components/ListingCard.tsx`
- Detail page component: `src/components/ToolPage.tsx`
- Shared provider logo component: `src/components/ProviderLogoPlate.tsx`

## Listing Type

Future listings that describe a business a user can start should use:

- `listingType: 'opportunity'`
- `status: 'published'` when ready for production
- `featured: false` unless editorially selected
- `verified: true` is assigned by the converter
- `isBlueprint: true` is assigned by the converter

Use the company-specific category, tags and partner model, but keep the structure compatible with Selfnamed.

## Required Field Structure

Each curated business listing must include the full `BusinessListing` structure:

- Identity: `id`, `slug`, `name`
- Summary: `tagline`, `shortDescription`
- Classification: `category`, `categoriesList`, `tags`, `listingType`, `partnerModels`, `partnerModel`
- Business model: `youSell`, `providerHandles`, `youEarnThrough`
- Card metrics: `startCost`, `revenueModel`, `difficulty`
- Provider: `provider.name`, `provider.website`, `provider.programUrl`, `provider.affiliateUrl`
- Overview: `businessType`, `inventoryRequired`, `codingRequired`, `recurringRevenue`, `whiteLabel`
- Content sections: `whatYouSell`, `targetCustomers`, `howItWorks`, `exampleBusinessModel`, `platformCosts`, `whyProvider`, `requirements`, `monetization`
- Publishing metadata: `status`, `featured`, `lastVerified`, `upvotes`

## Content Depth

Match Selfnamed's level of specificity:

- `tagline`: one concise outcome-oriented sentence fragment, no period.
- `shortDescription`: 2 sentences or one substantial sentence explaining the business, provider role and practical starting model.
- `tags`: 6-10 lowercase tags covering vertical, model, channel and execution style.
- `categoriesList`: 3 clear reader-facing categories. Include `Business Blueprint` for business-start listings.
- `whatYouSell.items`: 5-6 concrete sellable outputs, not generic benefits.
- `targetCustomers`: 5-6 specific customer/operator segments.
- `howItWorks`: 5-6 numbered steps from niche/offer selection through validation and scaling.
- `platformCosts`: at least 2 entries covering setup/subscription and variable usage/order costs.
- `whyProvider`: 2-3 provider-specific reasons grounded in the company's actual strengths.
- `requirements`: 4-5 label/value pairs describing what the operator needs.
- `monetization`: describe the actual earning mechanism and material costs deducted before profit.

Avoid thin listings. A future listing should feel useful even before the user visits the provider website.

## Formatting Rules

- Use stable URL-safe lowercase ids and slugs, e.g. `company-model-vertical`.
- Use title case for `name`, `partnerModel`, `revenueModel`, `difficulty` and visible plan labels.
- Use sentence case for descriptions, notes and step descriptions.
- Keep `startCost` short enough for the card metric column, e.g. `Free setup`, `$29/mo`, `Partner-based`.
- Keep `revenueModel` short enough for the card metric column, e.g. `Product Margin`, `Recurring`, `Sales Margin`.
- Use an en dash only when the surrounding file already uses one for labels like `Easy–Medium`.
- Do not use promotional hype, guaranteed income claims or unsupported superlatives.
- Keep earnings language conservative and cost-aware.
- Include the shared `disclaimer` for example business model scenarios where revenue or margins are discussed.

## Favicon Handling

Use metadata/favicon logos instead of manually uploaded provider images.

- Set `provider.website` to the provider's canonical public website.
- The converter derives `logoUrl` and `providerLogoUrl` from `provider.website` using Google favicon metadata:
  `https://www.google.com/s2/favicons?domain=<hostname>&sz=128`
- `provider.logo` may contain the same favicon URL for readability, but the converter should remain the source of truth.
- Do not recolor external favicons.
- Do not add local provider image files for new curated business listings.
- The UI container must provide the Vebpartner visual frame around arbitrary external favicon colors.

If a favicon appears blank or low-contrast, prefer a better factual favicon source or a stronger neutral container treatment. Do not invent a custom brand mark.

## CTA Logic

Provider links must follow this hierarchy:

- Primary external CTA uses `provider.affiliateUrl` when available.
- If no affiliate URL exists, use the provider program URL or canonical provider website.
- `provider.programUrl` should point to the most relevant partner, white-label, affiliate, reseller, dropshipping or supplier page.
- `provider.website` should remain the canonical company home domain used for favicon derivation and provider context.

The detail page renders blueprint CTAs from `affiliateUrl`, `providerProgramUrl` and `providerUrl` after conversion. Keep all provider URLs factual and current at the time the listing is created or verified.

## Component Usage

New business listings should rely on existing components and converter output:

- `businessListingToToolListing` maps curated data into `ToolListing`.
- `ListingCard` renders the grid/list card, metrics, badge, bookmark control and powered-by footer.
- `ProviderLogoPlate` renders the provider favicon/logo plate in the powered-by area.
- `ToolPage` renders the full detail page, provider block, CTA buttons, overview, blueprint sections and sidebar metrics.
- `getListingTypeLabel` and `getListingTypeCardClasses` control the listing badge and card treatment.
- `businessTaxonomy` controls primary category, visible category labels and filter tags.

Do not duplicate these rendering rules inside individual listing data. Listing data should describe the company and business model; components should control presentation.

## Selfnamed Header Logo Test

Selfnamed currently has a card-only header favicon placement test in `ListingCard`. Treat that as a UI experiment, not as part of the required data model for every future listing until it is approved for rollout.

Future listings must still provide the same favicon-ready provider fields so the placement can be enabled globally later without data changes.

## Quality Checklist

Before adding a future listing, confirm:

- The listing uses the full `BusinessListing` structure.
- All URLs are company-specific and relevant.
- The favicon is derived from the canonical provider website.
- The card metrics are short, readable and factual.
- The detail sections are at Selfnamed-level depth.
- The monetization copy explains costs and margin reality.
- The CTA uses the correct provider, program or affiliate URL.
- The listing renders through the existing converter and components.
- The listing does not require uploading a local image.
- The listing passes TypeScript, build and any relevant visual smoke check.
