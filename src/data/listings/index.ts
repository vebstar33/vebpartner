import { businessListingToToolListing } from './listing.schema';
import { batch01Listings } from './batch01';
import { batch02Listings } from './batch02';
import { batch03Listings } from './batch03';
import { crmAutomationAgency } from './crmAutomationAgency';

export const BUSINESS_LISTINGS = [crmAutomationAgency, ...batch01Listings, ...batch02Listings, ...batch03Listings];

export const BUSINESS_TOOL_LISTINGS = BUSINESS_LISTINGS.map(businessListingToToolListing);

export type { BusinessListing } from './listing.schema';
