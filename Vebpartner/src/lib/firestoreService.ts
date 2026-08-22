import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  increment,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from './firebase';
import {
  ToolListing,
  Category,
  Advertisement,
  CustomPage,
  SiteSettings,
  UserSubmission,
} from '../types';
import {
  INITIAL_LISTINGS,
  INITIAL_CATEGORIES,
  INITIAL_ADS,
  INITIAL_PAGES,
  INITIAL_SITE_SETTINGS,
} from '../data/seedListings';

// Designate primary root admin email
export const ROOT_ADMIN_EMAIL = 'yogigunes@gmail.com';

// Check if current user is an authorized admin
export async function checkUserIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.email && user.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminDoc.exists()) {
      return true;
    }
  } catch {
    // If not accessible or error, fallback to email check
  }
  return false;
}

// ----------------------------------------------------
// Realtime Subscriptions with Auto-Seeding
// ----------------------------------------------------

export function subscribeListings(
  onData: (listings: ToolListing[]) => void,
  onError?: (error: any) => void
): Unsubscribe {
  const path = 'listings';
  const collRef = collection(db, path);

  return onSnapshot(
    collRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Auto-seed if Firestore is completely empty
        try {
          await seedInitialListings();
        } catch (err) {
          console.warn('Auto-seeding listings encountered an issue, using memory fallback', err);
          onData(INITIAL_LISTINGS.map(l => ({ ...l, status: l.status || 'published' })));
          return;
        }
      } else {
        const items: ToolListing[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ToolListing;
          items.push({
            ...data,
            id: docSnap.id,
            status: data.status || 'published',
          });
        });
        onData(items);
      }
    },
    (error) => {
      console.error('Listings snapshot error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeCategories(
  onData: (categories: Category[]) => void
): Unsubscribe {
  const path = 'categories';
  const collRef = collection(db, path);

  return onSnapshot(
    collRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          await seedInitialCategories();
        } catch {
          onData(INITIAL_CATEGORIES);
        }
      } else {
        const items: Category[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as Category), id: d.id }));
        onData(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeAds(
  onData: (ads: Advertisement[]) => void
): Unsubscribe {
  const path = 'advertisements';
  const collRef = collection(db, path);

  return onSnapshot(
    collRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          await seedInitialAds();
        } catch {
          onData(INITIAL_ADS);
        }
      } else {
        const items: Advertisement[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as Advertisement), id: d.id }));
        onData(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribePages(
  onData: (pages: CustomPage[]) => void
): Unsubscribe {
  const path = 'customPages';
  const collRef = collection(db, path);

  return onSnapshot(
    collRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          await seedInitialPages();
        } catch {
          onData(INITIAL_PAGES);
        }
      } else {
        const items: CustomPage[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as CustomPage), id: d.id }));
        onData(items);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeSiteSettings(
  onData: (settings: SiteSettings) => void
): Unsubscribe {
  const path = 'siteSettings';
  const docRef = doc(db, path, 'global');

  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, INITIAL_SITE_SETTINGS);
          onData(INITIAL_SITE_SETTINGS);
        } catch {
          onData(INITIAL_SITE_SETTINGS);
        }
      } else {
        onData(snapshot.data() as SiteSettings);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/global`);
    }
  );
}

export function subscribeSubmissions(
  onData: (submissions: UserSubmission[]) => void
): Unsubscribe {
  const path = 'userSubmissions';
  const collRef = collection(db, path);

  return onSnapshot(
    collRef,
    (snapshot) => {
      const items: UserSubmission[] = [];
      snapshot.forEach((d) => items.push({ ...(d.data() as UserSubmission), id: d.id }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ----------------------------------------------------
// Seeding Helpers
// ----------------------------------------------------

export async function seedInitialListings() {
  const batch = writeBatch(db);
  for (const item of INITIAL_LISTINGS) {
    const docRef = doc(db, 'listings', item.id);
    batch.set(docRef, {
      ...item,
      status: item.status || 'published',
    });
  }
  await batch.commit();
}

export async function seedInitialCategories() {
  const batch = writeBatch(db);
  for (const item of INITIAL_CATEGORIES) {
    const docRef = doc(db, 'categories', item.id);
    batch.set(docRef, item);
  }
  await batch.commit();
}

export async function seedInitialAds() {
  const batch = writeBatch(db);
  for (const item of INITIAL_ADS) {
    const docRef = doc(db, 'advertisements', item.id);
    batch.set(docRef, item);
  }
  await batch.commit();
}

export async function seedInitialPages() {
  const batch = writeBatch(db);
  for (const item of INITIAL_PAGES) {
    const docRef = doc(db, 'customPages', item.id);
    batch.set(docRef, item);
  }
  await batch.commit();
}

export async function seedAllDataToFirestore() {
  await Promise.all([
    seedInitialListings(),
    seedInitialCategories(),
    seedInitialAds(),
    seedInitialPages(),
    setDoc(doc(db, 'siteSettings', 'global'), INITIAL_SITE_SETTINGS),
  ]);
}

// ----------------------------------------------------
// Listings Mutation Methods
// ----------------------------------------------------

export async function createListingFirestore(listing: Partial<ToolListing>): Promise<ToolListing> {
  const id =
    listing.id ||
    listing.slug ||
    listing.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
    `tool_${Date.now()}`;
  const now = new Date().toISOString();

  const newListing: ToolListing = {
    id,
    name: listing.name || 'Untitled Tool',
    slug: listing.slug || id,
    tagline: listing.tagline || '',
    description: listing.description || '',
    replaces: listing.replaces || [],
    category: listing.category || 'agencies-services',
    categoriesList: listing.categoriesList || [],
    tags: listing.tags || ['Open Source'],
    techStack: listing.techStack || ['TypeScript'],
    license: listing.license || 'MIT',
    githubUrl: listing.githubUrl || '',
    stars: Number(listing.stars) || 0,
    starsChange30d: listing.starsChange30d || '+0 (0%)',
    forks: Number(listing.forks) || 0,
    websiteUrl: listing.websiteUrl || '',
    docsUrl: listing.docsUrl || '',
    demoUrl: listing.demoUrl || '',
    dockerCommand: listing.dockerCommand || '',
    pricingModel: listing.pricingModel || '100% Free Open Source',
    logoUrl: listing.logoUrl || '',
    screenshotUrl: listing.screenshotUrl || '',
    featured: Boolean(listing.featured),
    verified: listing.verified !== undefined ? Boolean(listing.verified) : true,
    status: listing.status || 'published',
    isAiNative: Boolean(listing.isAiNative),
    isSponsored: Boolean(listing.isSponsored),
    listingType: listing.listingType,
    partnerModels: listing.partnerModels || [],
    partnerModel: listing.partnerModel,
    youSell: listing.youSell,
    providerHandles: listing.providerHandles,
    youEarnThrough: listing.youEarnThrough,
    adCtaText: listing.adCtaText || '',
    adCtaUrl: listing.adCtaUrl || '',
    lastCommit: listing.lastCommit || 'Recent',
    repoAge: listing.repoAge || '1 year',
    version: listing.version || 'v1.0.0',
    selfHosted: listing.selfHosted || 'Yes',
    upvotes: Number(listing.upvotes) || 0,
    createdAt: listing.createdAt || now,
    updatedAt: now,
    comparisonPoints: listing.comparisonPoints || [],
    pros: listing.pros || [],
    cons: listing.cons || [],
    detailedParagraphs: listing.detailedParagraphs || [],
    similarProjects: listing.similarProjects || [],
  };

  const path = `listings/${id}`;
  try {
    await setDoc(doc(db, 'listings', id), newListing);
    return newListing;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function updateListingFirestore(
  id: string,
  updates: Partial<ToolListing>
): Promise<ToolListing> {
  const path = `listings/${id}`;
  try {
    const docRef = doc(db, 'listings', id);
    const existing = await getDoc(docRef);
    const existingData = existing.exists() ? (existing.data() as ToolListing) : {};

    const updatedData: ToolListing = {
      ...existingData,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    } as ToolListing;

    await setDoc(docRef, updatedData, { merge: true });
    return updatedData;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

export async function setListingStatusFirestore(
  id: string,
  status: 'published' | 'draft'
): Promise<void> {
  return updateListingFirestore(id, { status } as any).then(() => {});
}

export async function deleteListingFirestore(id: string): Promise<void> {
  const path = `listings/${id}`;
  try {
    await deleteDoc(doc(db, 'listings', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function upvoteListingFirestore(id: string, delta: number = 1): Promise<number> {
  const path = `listings/${id}`;
  try {
    const docRef = doc(db, 'listings', id);
    await updateDoc(docRef, {
      upvotes: increment(delta),
    });
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data().upvotes || 0 : 0;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

// ----------------------------------------------------
// Categories CRUD
// ----------------------------------------------------

export async function saveCategoryFirestore(category: Partial<Category>): Promise<Category> {
  const id =
    category.id && !category.id.startsWith('cat_new_')
      ? category.id
      : category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `cat_${Date.now()}`;
  const path = `categories/${id}`;

  const catData: Category = {
    id,
    name: category.name || 'Category',
    icon: category.icon || 'Folder',
    description: category.description || '',
    count: category.count || 0,
    badgeColor: category.badgeColor || 'emerald',
    featured: Boolean(category.featured),
  };

  try {
    await setDoc(doc(db, 'categories', id), catData, { merge: true });
    return catData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteCategoryFirestore(id: string): Promise<void> {
  const path = `categories/${id}`;
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// ----------------------------------------------------
// Ads CRUD
// ----------------------------------------------------

export async function saveAdFirestore(ad: Partial<Advertisement>): Promise<Advertisement> {
  const id =
    ad.id && !ad.id.startsWith('ad_new_')
      ? ad.id
      : `ad_${Date.now()}`;
  const path = `advertisements/${id}`;

  const adData: Advertisement = {
    id,
    title: ad.title || 'Sponsor Title',
    sponsorName: ad.sponsorName || 'Sponsor',
    logoUrl: ad.logoUrl || '',
    badgeText: ad.badgeText || 'Sponsored',
    description: ad.description || '',
    ctaText: ad.ctaText || 'Learn More',
    ctaUrl: ad.ctaUrl || '#',
    placement: ad.placement || 'sidebar',
    active: ad.active !== undefined ? Boolean(ad.active) : true,
    impressions: Number(ad.impressions) || 0,
    clicks: Number(ad.clicks) || 0,
    bgGradient: ad.bgGradient || 'from-emerald-500/20 to-teal-500/10',
    createdAt: ad.createdAt || new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'advertisements', id), adData, { merge: true });
    return adData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteAdFirestore(id: string): Promise<void> {
  const path = `advertisements/${id}`;
  try {
    await deleteDoc(doc(db, 'advertisements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function trackAdClickFirestore(id: string): Promise<void> {
  const path = `advertisements/${id}`;
  try {
    const docRef = doc(db, 'advertisements', id);
    await updateDoc(docRef, {
      clicks: increment(1),
    });
  } catch {
    // Non-blocking
  }
}

// ----------------------------------------------------
// Custom Pages CRUD
// ----------------------------------------------------

export async function savePageFirestore(page: Partial<CustomPage>): Promise<CustomPage> {
  const id =
    page.id && !page.id.startsWith('page_new_')
      ? page.id
      : `page-${page.slug || Date.now()}`;
  const path = `customPages/${id}`;

  const pageData: CustomPage = {
    id,
    slug: page.slug || id.replace(/^page-/, ''),
    title: page.title || 'Untitled Page',
    subtitle: page.subtitle || '',
    badge: page.badge || '',
    contentMarkdown: page.contentMarkdown || '# Page Content',
    published: page.published !== undefined ? Boolean(page.published) : true,
    showInMenu: Boolean(page.showInMenu),
    showInFooter: Boolean(page.showInFooter),
    category: page.category || 'company',
    lastUpdated: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'customPages', id), pageData, { merge: true });
    return pageData;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deletePageFirestore(id: string): Promise<void> {
  const path = `customPages/${id}`;
  try {
    await deleteDoc(doc(db, 'customPages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

// ----------------------------------------------------
// Site Settings
// ----------------------------------------------------

export async function saveSiteSettingsFirestore(
  settings: Partial<SiteSettings>
): Promise<SiteSettings> {
  const path = 'siteSettings/global';
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    const existing = await getDoc(docRef);
    const merged = {
      ...(existing.exists() ? existing.data() : INITIAL_SITE_SETTINGS),
      ...settings,
    } as SiteSettings;

    await setDoc(docRef, merged, { merge: true });
    return merged;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// ----------------------------------------------------
// Submissions
// ----------------------------------------------------

export async function submitToolFirestore(
  submission: Partial<UserSubmission>
): Promise<UserSubmission> {
  const id = `sub_${Date.now()}`;
  const path = `userSubmissions/${id}`;

  const subData: UserSubmission = {
    id,
    toolName: submission.toolName || '',
    tagline: submission.tagline || '',
    replaces: submission.replaces || '',
    githubUrl: submission.githubUrl || '',
    websiteUrl: submission.websiteUrl || '',
    category: submission.category || 'agencies-services',
    license: submission.license || 'MIT',
    submittedBy: submission.submittedBy || 'Anonymous',
    submittedAt: new Date().toISOString(),
    status: 'pending',
    notes: submission.notes || '',
  };

  try {
    await setDoc(doc(db, 'userSubmissions', id), subData);
    return subData;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function approveSubmissionFirestore(
  id: string,
  submission: UserSubmission
): Promise<ToolListing> {
  // 1. Create published listing in Firestore
  const newListing = await createListingFirestore({
    name: submission.toolName,
    tagline: submission.tagline,
    replaces: submission.replaces.split(',').map((s) => s.trim()).filter(Boolean),
    githubUrl: submission.githubUrl,
    websiteUrl: submission.websiteUrl,
    category: submission.category,
    license: submission.license || 'MIT',
    status: 'published',
    verified: true,
  });

  // 2. Mark submission approved
  await updateDoc(doc(db, 'userSubmissions', id), {
    status: 'approved',
  });

  return newListing;
}

export async function rejectSubmissionFirestore(id: string): Promise<void> {
  await updateDoc(doc(db, 'userSubmissions', id), {
    status: 'rejected',
  });
}

// ----------------------------------------------------
// Firebase Authentication Methods
// ----------------------------------------------------

export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
