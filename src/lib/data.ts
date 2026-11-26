import brandsRaw from '../../data/brands/index.json';
import plansRaw from '../../data/plans/index.json';
import couponsRaw from '../../data/coupons/index.json';
import linesRaw from '../../data/lines/index.json';
import regionsRaw from '../../data/regions/index.json';
import ipEvidenceRaw from '../../data/ip-evidence/index.json';
import performanceRaw from '../../data/performance/index.json';
import aiRaw from '../../data/ai/index.json';
import streamingRaw from '../../data/streaming/index.json';
import qualityIndexRaw from '../../data/quality-index/index.json';
import servicePoliciesRaw from '../../data/service-policies/index.json';
import evidenceSourcesRaw from '../../data/evidence-sources/index.json';
import correctionsRaw from '../../data/corrections/index.json';
import seoKeywordsRaw from '../../data/seo-keywords.json';

export interface BrandRecord {
  order: number;
  id: string;
  slug: string;
  name: string;
  shortName: string;
  nameEn: string;
  aliases?: string[];
  tagline: string;
  summary: string;
  audiences?: string[];
  affiliateUrl: string;
  officialUrl?: string | null;
  relationship: string;
  coupon?: {
    code: string;
    discount: string;
    appliesTo?: string[];
    excludes?: string[];
    limits?: string | null;
    usage?: string;
    note?: string;
    evidenceNature?: string;
  };
  regions?: string[];
  nodeCount?: number | null;
  nodeCountNote?: string | null;
  nodeCountByRegion?: Record<string, number> | null;
  lineTypes?: string[];
  ratio?: string;
  deviceLimit?: string;
  supportedPlatforms?: string[] | null;
  clientPolicy?: string[];
  streaming?: string[];
  aiTools?: string[];
  otherServices?: string[];
  streamingNote?: string;
  trafficRules?: string[];
  support?: {
    channels?: string[];
    refund?: string;
    trial?: string;
  };
  verifiedAt?: string;
}

export interface PlanRecord {
  id: string;
  brandId: string;
  brandName: string;
  category: string;
  planName: string;
  cycle: string;
  months: number | null;
  price: number;
  monthlyEquivalent: number | null;
  trafficGb: number | null;
  pricePerGb: number | null;
  notes?: string[];
  source: string;
  verifiedAt: string;
}

export const brands = brandsRaw as unknown as BrandRecord[];
export const plans = plansRaw as unknown as PlanRecord[];
export const coupons = couponsRaw;
export const lines = linesRaw;
export const regions = regionsRaw;
export const ipEvidence = ipEvidenceRaw;
export const performanceData = performanceRaw;
export const aiCompatibility = aiRaw;
export const streamingCompatibility = streamingRaw;
export const qualityIndex = qualityIndexRaw;
export const servicePolicies = servicePoliciesRaw;
export const evidenceSources = evidenceSourcesRaw;
export const corrections = correctionsRaw;
export const seoKeywords = seoKeywordsRaw;

export function getBrandBySlug(slug: string): BrandRecord | undefined {
  return brands.find((b) => b.slug === slug || b.id === slug);
}

export function getPlansByBrand(brandId: string): PlanRecord[] {
  return plans.filter((p) => p.brandId === brandId);
}

export function getQualityByBrand(brandId: string) {
  return qualityIndex.brands.find((q) => q.brandId === brandId);
}

export function getLineByBrand(brandId: string) {
  return lines.find((l) => l.brandId === brandId);
}

export function getAiByBrand(brandId: string) {
  return aiCompatibility.find((a) => a.brandId === brandId);
}

export function getStreamingByBrand(brandId: string) {
  return streamingCompatibility.find((s) => s.brandId === brandId);
}

export function getPolicyByBrand(brandId: string) {
  return servicePolicies.find((p) => p.brandId === brandId);
}

export function getIpEvidenceByBrand(brandId: string) {
  return ipEvidence.find((i) => i.brandId === brandId);
}

export function getSiteStats(articleCount = 30) {
  const eligibleCount = qualityIndex.brands.filter((q) => q.eligibleForRanking).length;
  return {
    totalBrands: brands.length,
    eligibleBrands: eligibleCount,
    verifiedPlans: plans.length,
    lineDeclarationsCount: lines.length,
    independentLineEvidenceCount: 0,
    performanceEvidenceCount: performanceData.records.length,
    publishedArticles: articleCount,
    latestVerifiedDate: '2026-11-26',
  };
}
